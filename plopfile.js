export default function (plop) {


    // SCAFFOLD — full stack in one shot
    plop.setGenerator('scaffold', {
        description: 'Generate the full stack for a new resource (service, query, modals, router)',
        prompts: [
            {
                type: 'input',
                name: 'name',
                message: 'Resource name? (e.g. "product")',
            },
        ],
        actions: [
            // TABLE CONFIG
            {
                type: 'modify',
                path: 'frontend/src/config/tableConfig.js',
                pattern: /(\/\/ ::PLOPPIN::)/,
                template: `{{camelCase name}}s: {
        headers: [
            {
                display: 'ID',
                key: 'id'
            },
        ],
        tableActions: {
            create: 'create{{pascalCase name}}',
            delete: 'delete{{pascalCase name}}',
            detail: '/{{camelCase name}}s/',
        }
    },`,
            },
            // PAGE
            {
                type: 'add',
                path: 'frontend/src/components/pages/{{pascalCase name}}sPage.jsx',
                templateFile: 'plop-templates/page-component.hbs',
            },
            {
                type: 'add',
                path: 'frontend/src/components/pages/Selected{{pascalCase name}}Page.jsx',
                templateFile: 'plop-templates/page-selected-component.hbs',
            },
            {
                type: 'modify',
                path: 'frontend/src/components/index.js',
                pattern: /(\/\/ ::PLOPPIN_PAGE::)/,
                template: "export { Selected{{pascalCase name}}Page } from './pages/Selected{{pascalCase name}}Page'\nexport { {{pascalCase name}}sPage } from './pages/{{pascalCase name}}sPage'\n$1",
            },
            {
                type: 'modify',
                path: 'frontend/src/config/routerConfig.js',
                pattern: /(\/\/ ::PLOPPIN_IMPORT::)/,
                template: "{{pascalCase name}}sPage,  \nSelected{{pascalCase name}}Page\n$1",
            },
            {
                type: 'modify',
                path: 'frontend/src/config/routerConfig.js',
                pattern: /(\/\/ ::PLOPPIN::)/,
                template: `
                            {
                                path: "/{{camelCase name}}s",
                                exact: true,
                                Component: {{pascalCase name}}sPage
                            },
                            {
                                path: "/{{camelCase name}}s/:{{camelCase name}}ID",
                                exact: true,
                                Component: Selected{{pascalCase name}}Page
                            },`,
            },
            {
                type: 'modify',
                path: 'frontend/src/components/template/NavBar.jsx',
                pattern: /({\/\*::PLOPPIN_MODAL::\*\/})/,
                template: `<Link className='hover:cursor-pointer' to='/{{camelCase name}}s'>
                        <Button color={'linkBlack'} className='bg-red-500 text-white px-3 py-1 rounded'>
                            {{pascalCase name}}s
                        </Button>
                    </Link>
                    $1`,
            },
            // modals
            {
                type: 'add',
                path: 'frontend/src/components/modals/{{pascalCase name}}FormModal.jsx',
                templateFile: 'plop-templates/modal-form.hbs',
            },
            {
                type: 'add',
                path: 'frontend/src/components/modals/{{pascalCase name}}DeleteModal.jsx',
                templateFile: 'plop-templates/modal-delete.hbs',
            },
            {
                type: 'modify',
                path: 'frontend/src/components/index.js',
                pattern: /(\/\/ ::PLOPPIN::)/,
                template: "export { {{pascalCase name}}FormModal } from './modals/{{pascalCase name}}FormModal'\nexport { {{pascalCase name}}DeleteModal } from './modals/{{pascalCase name}}DeleteModal'\n$1",
            },
            {
                type: 'modify',
                path: 'frontend/src/components/index.js',
                pattern: /(\/\/ ::PLOPPIN_MODAL::)/,
                template: "export { {{pascalCase name}}FormModal } from './modals/{{pascalCase name}}FormModal'\nexport { {{pascalCase name}}DeleteModal } from './modals/{{pascalCase name}}DeleteModal'\n$1",
            },
            {
                type: 'modify',
                path: 'frontend/src/components/template/ModalManager.jsx',
                pattern: /(\/\/ ::PLOPPIN_IMPORT::)/,
                template: "{{pascalCase name}}FormModal,\n    {{pascalCase name}}DeleteModal    \n$1",
            },
            {
                type: 'modify',
                path: 'frontend/src/components/template/ModalManager.jsx',
                pattern: /(\/\/ ::PLOPPIN_SWITCH::)/,
                template: `case 'delete{{pascalCase name}}':
                            return <{{pascalCase name}}DeleteModal />
                        case 'create{{pascalCase name}}':
                            return <{{pascalCase name}}FormModal />
                        case 'update{{pascalCase name}}':
                            return <{{pascalCase name}}FormModal isUpdate={true} />`,
            },
            // service
            {
                type: 'add',
                path: 'frontend/src/api/services/sub/{{camelCase name}}.js',
                templateFile: 'plop-templates/service.hbs',
            },{
                type: 'modify',
                path: 'frontend/src/api/services/index.js',
                pattern: /(\/\/ ::PLOPPIN::)/,
                template: "export { {{camelCase name}}Service } from './sub/{{camelCase name}}'\n$1",
            },
            // query
            {
                type: 'add',
                path: 'frontend/src/api/reactQuery/sub/use{{pascalCase name}}Query.js',
                templateFile: 'plop-templates/query.hbs',
            },{
                type: 'modify',
                path: 'frontend/src/api/reactQuery/index.js',
                pattern: /(\/\/ ::PLOPPIN::)/,
                template: "export { use{{pascalCase name}}Query } from './sub/use{{pascalCase name}}Query';\n$1",
            },
            // BACK END :: router
            {
                type: 'add',
                path: 'backend/routers/{{camelCase name}}s.router.js',
                templateFile: 'plop-templates/router.hbs',
            },
            {
                type: 'modify',
                path: 'backend/app.js',
                pattern: /(\/\/ ::PLOPPIN::)/,
                template: "const {{upperCase name}}S_ROUTER = require('./routers/{{camelCase name}}s.router');\napp.use('/api/{{camelCase name}}', authMiddleware, {{upperCase name}}S_ROUTER);\n$1",
            },
        ],
    });

    // COMPONENT — frontend/src/components/library
    // plop.setGenerator('component', {
    //     description: 'Create a new React component in the library',
    //     prompts: [
    //         {
    //             type: 'input',
    //             name: 'name',
    //             message: 'Component name?',
    //         },
    //     ],
    //     actions: [
    //         {
    //             type: 'add',
    //             path: 'frontend/src/components/library/{{pascalCase name}}.jsx',
    //             templateFile: 'plop-templates/component.hbs',
    //         },
    //         {
    //             // append the export to frontend/src/components/index.js
    //             type: 'append',
    //             path: 'frontend/src/components/index.js',
    //             template: "export { {{pascalCase name}} } from './library/{{pascalCase name}}'",
    //         },
    //     ],
    // });


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
