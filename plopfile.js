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


    // MODAL — conditionally creates a form modal, delete modal, or both
    plop.setGenerator('modal', {
        description: 'Create a modal component (form, delete, or both)',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'What is this modal for? (e.g. "Product")',
            },
            {
                type: 'list',
                name: 'type',
                message: 'Which type of modal?',
                choices: ['form', 'delete', 'both'],
            },
        ],
        // actions can be a function that receives answers — return different actions based on them
        actions: (answers) => {
            const actions = [];

            if (answers.type === 'form' || answers.type === 'both') {
                actions.push({
                    type: 'add',
                    path: 'frontend/src/components/modals/{{pascalCase name}}FormModal.jsx',
                    templateFile: 'plop-templates/modal-form.hbs',
                });
                actions.push({
                    type: 'append',
                    path: 'frontend/src/components/index.js',
                    template: "export { {{pascalCase name}}FormModal } from './modals/{{pascalCase name}}FormModal'",
                });
            }

            if (answers.type === 'delete' || answers.type === 'both') {
                actions.push({
                    type: 'add',
                    path: 'frontend/src/components/modals/{{pascalCase name}}DeleteModal.jsx',
                    templateFile: 'plop-templates/modal-delete.hbs',
                });
                actions.push({
                    type: 'append',
                    path: 'frontend/src/components/index.js',
                    template: "export { {{pascalCase name}}DeleteModal } from './modals/{{pascalCase name}}DeleteModal'",
                });
            }

            return actions;
        },
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
