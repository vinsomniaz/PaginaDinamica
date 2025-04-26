const { CosmosClient } = require('@azure/cosmos');

module.exports = async function (context, req) {
    context.log('Processing purchase request');
    
    const endpoint = process.env.COSMOS_DB_ENDPOINT;
    const key = process.env.COSMOS_DB_KEY;
    const client = new CosmosClient({ endpoint, key });
    
    const database = client.database('CoursesDB');
    const container = database.container('Purchases');
    
    try {
        if (req.method === 'POST') {
            // Crear nueva compra
            const purchase = req.body;
            const { resource } = await container.items.create(purchase);
            
            context.res = {
                status: 201,
                body: resource
            };
        } else if (req.method === 'GET') {
            // Obtener todas las compras
            const { resources } = await container.items.readAll().fetchAll();
            
            context.res = {
                status: 200,
                body: resources
            };
        }
    } catch (error) {
        context.res = {
            status: 500,
            body: { error: error.message }
        };
    }
};