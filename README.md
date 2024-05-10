# CSCI 381 Final Project

Group members:
- Juan Mendez
- Tanatswa Manyakara

[Presentation Link](https://docs.google.com/presentation/d/1l1IDCB7GcJoJoPPGkl9yo13QN3kPXpNjbTa1TIq704A/edit?usp=sharing)
Also, add any files to this repository that you would need as part of your final project submission.

Finally, put any special instructions in this README about how to use your code/notebook.

1) Create a python virtual environment.
2) Make sure all the libraries in requirements.txt are installed by running `pip install -r requirements.txt`
3) Download the two saved model files [final_model_weights.pt](https://drive.google.com/file/d/1hrwrCbY78XR-NMOqy6itXoLozNIEVcX2/view?usp=sharing) and [res18-unet.pt](https://drive.google.com/file/d/1CEIAs_J50t1C0iXC0hk-HPAdLXCwB9Ia/view?usp=sharing) and place them in the `server/` directory.
4) To start the backend, run `python manage.py runserver` in the root directory `server/`
5) To start the frontend, make sure npm is installed and run `npm install` to initialize the node modules. To start the webapp client, run `npm start`.
6) Done, you may now begin to experiment with colorizing image

N.B The first attempt at colorization might take a minute as the model needs to load first but thereafter, all colorization attempts are instataneous.
