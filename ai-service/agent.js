//https://tutorialzine.com/2017/04/10-machine-learning-examples-in-javascript

//https://blog.webkid.io/neural-networks-in-javascript/
//https://github.com/amaneureka/T-Rex

//http://progur.com/2016/09/how-to-create-and-use-neural-networks-in-javascript.html

////////// Data Generation //////////
const mnist = require('mnist');

const set = mnist.set(700, 20);

const trainingSet = set.training;
const testSet = set.test;

////////// Network Creation //////////
const synaptic = require('synaptic');

const Layer = synaptic.Layer;
const Network = synaptic.Network;
const Trainer = synaptic.Trainer;

const inputLayer = new Layer(784);
const hiddenLayer = new Layer(100);
const outputLayer = new Layer(10);

inputLayer.project(hiddenLayer);
hiddenLayer.project(outputLayer);

const myNetwork = new Network({
    input: inputLayer,
    hidden: [hiddenLayer],
    output: outputLayer
});


////////// Trainer Creation //////////
const trainer = new Trainer(myNetwork);
trainer.train(trainingSet, {
    rate: .2,
    iterations: 20,
    error: .1,
    shuffle: true,
    log: 1,
    cost: Trainer.cost.CROSS_ENTROPY
});
