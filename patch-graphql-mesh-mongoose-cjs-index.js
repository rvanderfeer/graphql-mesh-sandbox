"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const graphql_1 = require("graphql");
const graphql_compose_1 = require("graphql-compose");
const graphql_compose_mongoose_1 = require("graphql-compose-mongoose");
const mongoose_1 = require("mongoose");
const utils_1 = require("@graphql-mesh/utils");
const modelQueryOperations = [
    'findById',
    'findByIds',
    'findOne',
    'findMany',
    'count',
    'connection',
    'pagination',
    'dataLoader',
    'dataLoaderMany',
];
const modelMutationOperations = [
    'createOne',
    'createMany',
    'updateById',
    'updateOne',
    'updateMany',
    'removeById',
    'removeOne',
    'removeMany',
];
class MongooseHandler {
    constructor({ name, config, baseDir, pubsub, importFn, logger, }) {
        this.name = name;
        this.config = config;
        this.baseDir = baseDir;
        this.pubsub = pubsub;
        this.importFn = importFn;
        this.logger = logger;
    }
    async getMeshSource() {
        if (this.config.connectionString) {
            (0, mongoose_1.connect)(this.config.connectionString, {
                // useNewUrlParser: true,
                // useUnifiedTopology: true,
                // logger: {
                //     className: this.name,
                //     debug: this.logger.debug.bind(this.logger),
                //     info: this.logger.info.bind(this.logger),
                //     warn: this.logger.warn.bind(this.logger),
                //     error: this.logger.error.bind(this.logger),
                //     isDebug() {
                //         return true;
                //     },
                //     isError() {
                //         return true;
                //     },
                //     isInfo() {
                //         return true;
                //     },
                //     isWarn() {
                //         return true;
                //     },
                // },
                // loggerLevel: 'debug',
            }).catch(e => this.logger.error(e));
            const id = this.pubsub.subscribe('destroy', () => {
                (0, mongoose_1.disconnect)()
                    .catch(e => this.logger.error(e))
                    .finally(() => this.pubsub.unsubscribe(id));
            });
        }
        const schemaComposer = new graphql_compose_1.SchemaComposer();
        const typeMergingOptions = {};
        await Promise.all([
            Promise.all(this.config.models?.map(async (modelConfig) => {
                const model = await (0, utils_1.loadFromModuleExportExpression)(modelConfig.path, {
                    defaultExportName: modelConfig.name,
                    cwd: this.baseDir,
                    importFn: this.importFn,
                });
                if (!model) {
                    throw new Error(`Model ${modelConfig.name} cannot be imported ${modelConfig.path}!`);
                }
                const modelTC = (0, graphql_compose_mongoose_1.composeWithMongoose)(model, modelConfig.options);
                await Promise.all([
                    Promise.all(modelQueryOperations.map(async (queryOperation) => schemaComposer.Query.addFields({
                        [`${modelConfig.name}_${queryOperation}`]: modelTC.getResolver(queryOperation),
                    }))),
                    Promise.all(modelMutationOperations.map(async (mutationOperation) => schemaComposer.Mutation.addFields({
                        [`${modelConfig.name}_${mutationOperation}`]: modelTC.getResolver(mutationOperation),
                    }))),
                ]);
                const typeName = modelTC.getTypeName();
                typeMergingOptions[typeName] = {
                    selectionSet: `{ id }`,
                    key: ({ id }) => id,
                    argsFromKeys: ids => ({ ids }),
                    fieldName: `${typeName}_dataLoaderMany`,
                };
            }) || []),
            Promise.all(this.config.discriminators?.map(async (discriminatorConfig) => {
                const discriminator = await (0, utils_1.loadFromModuleExportExpression)(discriminatorConfig.path, {
                    defaultExportName: discriminatorConfig.name,
                    cwd: this.baseDir,
                    importFn: this.importFn,
                });
                const discriminatorTC = (0, graphql_compose_mongoose_1.composeWithMongooseDiscriminators)(discriminator, discriminatorConfig.options);
                await Promise.all([
                    Promise.all(modelQueryOperations.map(async (queryOperation) => schemaComposer.Query.addFields({
                        [`${discriminatorConfig.name}_${queryOperation}`]: discriminatorTC.getResolver(queryOperation),
                    }))),
                    Promise.all(modelMutationOperations.map(async (mutationOperation) => schemaComposer.Mutation.addFields({
                        [`${discriminatorConfig.name}_${mutationOperation}`]: discriminatorTC.getResolver(mutationOperation),
                    }))),
                ]);
                const typeName = discriminatorTC.getTypeName();
                typeMergingOptions[typeName] = {
                    selectionSet: `{ id }`,
                    key: ({ id }) => id,
                    argsFromKeys: ids => ({ ids }),
                    fieldName: `${typeName}_dataLoaderMany`,
                };
            }) || []),
        ]);
        // graphql-compose doesn't add @defer and @stream to the schema
        graphql_1.specifiedDirectives.forEach(directive => schemaComposer.addDirective(directive));
        const schema = schemaComposer.buildSchema();
        return {
            schema,
        };
    }
}
exports.default = MongooseHandler;
