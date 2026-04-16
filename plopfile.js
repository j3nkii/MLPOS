export default function (plop) {

    // COMPONENT — frontend/src/components/library
    plop.setGenerator('component', {
        description: 'Create a new React component in the library',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Component name?',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'frontend/src/components/library/{{pascalCase name}}.jsx',
                templateFile: 'plop-templates/component.hbs',
            },
            {
                // append the export to frontend/src/components/index.js
                type: 'append',
                path: 'frontend/src/components/index.js',
                template: "export { {{pascalCase name}} } from './library/{{pascalCase name}}'",
            },
        ],
    });


    // QUERY — frontend/src/api/reactQuery/sub
    plop.setGenerator('query', {
        description: 'Create a new react-query hook in the query folder',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Query name? (e.g. "ticket" → useTicketQuery)',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'frontend/src/api/reactQuery/sub/use{{pascalCase name}}Query.js',
                templateFile: 'plop-templates/query.hbs',
            },
            {
                type: 'append',
                path: 'frontend/src/api/reactQuery/index.js',
                template: "export { use{{pascalCase name}}Query } from './sub/use{{pascalCase name}}Query';",
            },
        ],
    });


    // SERVICE — frontend/src/api/services/sub
    plop.setGenerator('service', {
        description: 'Create a new axios service in the services folder',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Service name? (e.g. "ticket" → ticketService)',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'frontend/src/api/services/sub/{{camelCase name}}.js',
                templateFile: 'plop-templates/service.hbs',
            },
            {
                type: 'append',
                path: 'frontend/src/api/services/index.js',
                template: "export { {{camelCase name}}Service } from './sub/{{camelCase name}}';",
            },
        ],
    });


    // ROUTER — backend/routers
    plop.setGenerator('router', {
        description: 'Create a new Express router in the backend',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Router name? (e.g. "ticket" → ticket.router.js)',
            },
        ],
        actions: [
            {
                type: 'add',
                path: 'backend/routers/{{camelCase name}}.router.js',
                templateFile: 'plop-templates/router.hbs',
            },
            {
                // remind yourself to wire it up in app.js
                type: 'append',
                path: 'backend/app.js',
                template: "// TODO: const {{upperCase (camelCase name)}}_ROUTER = require('./routers/{{camelCase name}}.router');\n// TODO: app.use('/api/{{camelCase name}}', authMiddleware, {{upperCase (camelCase name)}}_ROUTER);",
            },
        ],
    });

}
