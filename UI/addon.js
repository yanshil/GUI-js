var addon = require('bindings')('addon.node')

function testCpp()
{
    console.log('Move position!')
    console.log('This should be 2.5:', addon.add(5))
}

console.log('This should be 1.5:', addon.add(3))
