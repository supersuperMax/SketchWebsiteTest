const express = require('express');
const mongoose = require('mongoose');
const http = require('http');

mongoose.connect('mongodb://localhost:27017/Test')
    .then( () => console.log('Connected!'));

// Models
const Project = mongoose.model('Project', new mongoose.Schema({
    name: String,
    data: Object,
    createdAt: { type: Date, default: Date.now}
}))

const app = express();
const server = http.Server(app);

app.get('/', async function (req, resp) {
    // console.log(resp);
    await resp.sendFile('index.html', {root : __dirname + '../../../'});
    
});

app.use(express.json());

// CRUD

//project creation
app.post('/projects', async function(req, resp) {
    try {
        const project = new Project({
            ...req.body
        });

        await project.save();
        
        resp.status(201).send(project);
        console.log('project created!', req.body);
    } catch (error) {
        resp.status(400).send({ error: 'Project creation failed' });
    }
});

//project view
app.get('/projects/:id', async function (req, resp) {
    try {
        const project = await Project.findById(req.params.id);

        if (!project) {
            return resp.status(404).send();
        }

        resp.send(project);
    } catch (error) {
        resp.status(500).send();
    }
})

app.listen(3000);