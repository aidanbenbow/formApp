import express from 'express';
const router = express.Router();

import { saveFormData, getFormData, getOneFormData, saveFormDatatoTest, getAllFormData, getFormDataByFormId } from '../config/dynamoDB.js';

router.get('/', (req, res) => {
    res.render('index');
    })

router.get('/form/:formID', async (req, res) => {
    const formID = req.params.formID;

    try {
        const info = await getOneFormData(formID);
        const data = info.Item;
        
        const result = [data.id.S];
        const inputs = Object.keys(data)
  .filter(key => key.startsWith('input'))
  .sort((a, b) => {
    const numA = parseInt(a.replace('input', ''), 10);
    const numB = parseInt(b.replace('input', ''), 10);
    return numA - numB;
  })
  .map(key => data[key].S);
        
        result.push(...inputs);
       // console.log('Form data retrieved:', result);
        if (result) {
            res.render('form', {formData: result });
        } else {
            res.status(404).send('Form not found');
        }

    } catch (error) {
        console.error('Error retrieving form data:', error);
        res.status(500).send('Error retrieving form data');
    }
} );

router.get('/allforms', async (req, res) => {
    try {
        const data = await getFormData();
        const forms = data.Items;
       // console.log('All forms retrieved:', forms);
        if (forms) {
            res.render('allforms', { forms });
        } else {
            res.status(404).send('No forms found');
        }
    } catch (error) {
        console.error('Error retrieving form data:', error);
        res.status(500).send('Error retrieving form data');
    }
} );

router.get('/thankyou', (req, res) => {
    res.render('thankyou');
});

router.get('/answers/:formID', async (req, res) => {
    const formID = req.params.formID;
    
    try {
        const data = await getFormDataByFormId(formID);
       
       console.log('All answers retrieved:', data);

       // Select a random item from the data array
    const randomIndex = Math.floor(Math.random() * data.length);
    const randomInput0Value = data[randomIndex].input0;
       
        if (data) {
            res.render('answers', { answers: data, random: randomInput0Value });
        } else {
            res.status(404).send('No answers found');
        }
    } catch (error) {
        console.error('Error retrieving form data:', error);
        res.status(500).send('Error retrieving form data');
    }
} );


    router.post('/submitted', async (req, res) => {
      // console.log('Form data received:', req.body);
        const formData = req.body;
        

       // Save the form data to DynamoDB
        try {
            await saveFormDatatoTest(formData);
            res.redirect('/thankyou');
        } catch (error) {
            console.error('Error saving form data:', error);
            res.status(500).send('Error saving form data');
        }

        // Redirect to thank you page
       
        
    });

    router.post('/submit', async (req, res) => {
        const formData = req.body;
       console.log('Form data received:', formData);

        // Save the form data to DynamoDB
        try {
            await saveFormData(formData);
            res.redirect('/thankyou');
        } catch (error) {
            console.error('Error saving form data:', error);
            res.status(500).send('Error saving form data');
        }

        
    });

    export default router;

