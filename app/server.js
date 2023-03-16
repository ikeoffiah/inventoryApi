const express = require('express')
const colors = require('colors')
const dotenv = require('dotenv').config()
const port = process.env.PORT || 8000
const connectDB = require('./config/db')
const cloudinary = require('cloudinary').v2
const swaggerJSDoc = require('swagger-jsdoc')
const swaggerUi = require('swagger-ui-express')
const YAML = require('yamljs')
const swaggerDocument = YAML.load('./app/swagger.yml');

//Connect database
connectDB()


const app = express()

app.listen(port, () => console.log(`Server is running at ${port}`))

app.use(express.json())
app.use(express.urlencoded({extended: false}))

//Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });


app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument))


app.use('/api/inventory/category', require('./routes/categoryRoute'))
app.use('/api/inventory/product', require('./routes/productRoute'))