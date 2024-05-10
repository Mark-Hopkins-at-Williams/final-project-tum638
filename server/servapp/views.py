import io
from django.shortcuts import render
import base64
import numpy as np
from django.http import JsonResponse
from django import forms
from django.views.decorators.csrf import csrf_exempt
from skimage.color import rgb2lab, lab2rgb
from matplotlib import pyplot as plt
from torchvision import transforms
from PIL import Image
import torch
from .infer import load_model



def lab_to_rgb(L, ab):
    """
    Takes a batch of images
    """

    L = (L + 1.) * 50.
    ab = ab * 110.
    Lab = torch.cat([L, ab], dim=1).permute(0, 2, 3, 1).cpu().numpy()
    rgb_imgs = []
    for img in Lab:
        img_rgb = lab2rgb(img)
        rgb_imgs.append(img_rgb)
    return np.stack(rgb_imgs, axis=0)

class ImageUploadForm(forms.Form):
    file = forms.ImageField()
# Create your views here.
@csrf_exempt 
def index(request):
    print("index hit")
    model, device = load_model()
    if request.method == "POST":
        form = ImageUploadForm(request.POST, request.FILES)
        if form.is_valid():
            img = form.cleaned_data['file']
            img = Image.open(img)
            img = img.resize((256, 256))
            img = transforms.ToTensor()(img)[:1] * 2. - 1.
            model.eval()
            with torch.no_grad():
                preds = model.net_G(img.unsqueeze(0).to(device))
            
            # Convert colorized image to JPEG
            colorized = lab_to_rgb(img.unsqueeze(0), preds.cpu())[0]
            buffered = io.BytesIO()
            plt.imsave(buffered, colorized, format='jpeg')
            plt.close()

            # Convert image to base64 string
            base64_image = base64.b64encode(buffered.getvalue()).decode('utf-8')

            # Prepare JSON response
            response_data = {'image': base64_image}

            return JsonResponse(response_data)
        else:
            print("form was not valid")
            return JsonResponse({"message":"not valid"})
@csrf_exempt
def compare(request):
    if request.method == "POST":
        # print(request.POST)
        colorized_image = Image.open(request.FILES['colorized'])
        original_image = Image.open(request.FILES['original'])

        # Convert images to tensors
        tensor_colorized = convert_image_to_tensor(colorized_image)
        tensor_original = convert_image_to_tensor(original_image)
        difference = similarity(tensor_original, tensor_colorized).item()
        print(difference)
        return JsonResponse({"difference": difference})
    return JsonResponse({"error": "something went wrong"})

def convert_image_to_tensor(image):
    """Convert an image file to a PyTorch tensor"""
    preprocess = transforms.Compose([
        transforms.Resize((256, 256)),  # Resize the image to 256x256
        transforms.ToTensor(),          # Convert to tensor
    ])
    image_tensor = preprocess(image)
    return image_tensor

def similarity(img1, img2):
    difference = torch.sub(img1, img2)
    squared_difference = torch.square(difference)
    return squared_difference
    # return torch.mean(squared_difference)