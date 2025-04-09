import express from 'express';
const router = express.Router();

import { saveFormData, getFormData, getOneFormData, saveFormData2 } from '../config/dynamoDB.js';

router.get('/', (req, res) => {
    res.render('index');
    })

router.get('/form/:formID', async (req, res) => {
    const formID = req.params.formID;

    try {
        const info = await getOneFormData(formID);
        
const data = info.Item;
const form = data.fields;
const formData = form.L.map(item => item.S);
console.log('Form data retrieved:', formData);
        if (formData) {
            res.render('form', { formData  });
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
        console.log('All forms retrieved:', forms);
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


    router.post('/submitted', async (req, res) => {
       console.log('Form data received:', req.body);
        const formData = req.body;

        // Save the form data to DynamoDB
        try {
            await saveFormData2(formData);
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

