
const utils = require("./graphman-utils");
const graphman = require("./graphman");

module.exports = {
    /**
     * Available GraphQL schema files will be processed to work with graphman configuration using GraphQL types
     * @param params
     */
    run: function (params) {
        if (params.options.refresh) {
            graphman.refreshSchemaMetadata();
            utils.info("pre-compiled schema is refreshed");
        }

        const metadata = graphman.schemaMetadata();
        utils.info("supported schema(s) [" + metadata.schemaVersion + "]");
        utils.info("supported entity types:");
        Object.keys(metadata.types).sort().forEach(key => {
            const value = metadata.types[key];
            if (value && value.pluralMethod) utils.print(`         ${key} - ${value.pluralMethod}`);
        });
        utils.print();
    },

    initParams: function (params, config) {
        params.options = Object.assign({refresh: false}, params.options);
        return params;
    },

    usage: function () {
        console.log("schema");
        console.log("  [--options.<name> <value>,...]");
        console.log();
        console.log("GraphQL schema will be pre-compiled and serialized to schema/metadata.json file.");
        console.log();
        console.log("  --options.<name> <value>");
        console.log("    specify options as name-value pair(s) to customize the operation");
        console.log("      .refresh false|true");
        console.log("        to refresh the pre-compiled schema");
    }
}
