'use strict';

var
    program = require('commander'),
    request = require('request'),
    config = require('./config.js'),
    resources = require('./lib/resourceService'),
    houses = require('./lib/houseService');

function showError(message) {
    console.log("An Error ocurred:\n\n\t" + message);
    process.exit(1);
}

function showOutput(message) {
    console.log(JSON.stringify(message, null, 4));
    process.exit(0);
}

function showCallback(error, result) {
    if (error) {
        showError(error);
    } else {
        showOutput(result);
    }
}

program
    .version('0.0.1')
    .usage('<command> [options]');

program
    .command('createDesign [name] [resourceList] [value]')
    .description('\n\nUse this command to create new designs, indicating the name, value and a comma-separated\n' +
        'list of the resources needed to build it. Repeat the name of the resource when multiple\n' +
        ' instances of it are to be required\n\n')
    .action(function (name, resourceList, value) {
        var resources = resourceList.split(',');

        houses.createDesign(name, resources, value, showCallback);
    });

program
    .command('createHouse [login] [designId] [resourceList]')
    .description('\n\nThis command buys a new house for the user indicated in the login. The resource used to \n' +
        'build the house must exist, and will be deleted as usual once the house is constructed. The resources\n' +
        'should serialized as a comma-separated list of the resource IDs\n\n')
    .action(function (login, design, resourceList) {
        var resources = resourceList.split(',');

        houses.buyHouse(login, design, resources, showCallback);
    });

program
    .command('listHouses')
    .description('\n\nReturn a list of all the created houses\n\n')
    .action(function () {
        houses.listHouses(showCallback);
    });

program
    .command('listResources')
    .description('\n\nReturn a list of all the available resources\n\n')
    .action(function () {
        resources.list(showCallback);
    });

program
    .command('listDesigns')
    .description('\n\nReturn a list of all the available designs\n\n')
    .action(function () {
        houses.listDesigns(showCallback);
    });

program
    .command('removeDesign [id]')
    .description('\n\nRemove the selected design from the DB\n\n')
    .action(function (id) {
        houses.removeDesign(id, function (error, removedDesigns) {
            if (error) {
                showError(error);
            } else {
                showOutput({
                    numberOfRemovals: removedDesigns
                });
            }
        });
    });

program
    .command('removeHouse [id]')
    .description('\n\nRemove the selected house from the DB\n\n')
    .action(function (id) {
        houses.removeHouse(id, function (error, removedHouses) {
            if (error) {
                showError(error);
            } else {
                showOutput({
                    numberOfRemovals: removedHouses
                });
            }
        });
    });

program
    .command('removeResource [id]')
    .description('\n\nRemove the selected resource from the DB\n\n')
    .action(function (id) {
        resources.remove(id, function (error, removedResources) {
            if (error) {
                showError(error);
            } else {
                showOutput({
                    numberOfRemovals: removedResources
                });
            }
        });
    });

program.parse(process.argv);


