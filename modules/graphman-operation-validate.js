const utils = require("./graphman-utils");
const policySchema = require("./policy-schema");

var error = false;
var policyErrors = false;
module.exports = {
    schemaValidator: null,
    run: function (params) {
        if (params.input) {
            buildPolicySchema()
            const obj = utils.readFile(params.input)
            validateBundle(obj);
            if (!error) {
                utils.info("validation is successful");
            }
        }
    },

    usage: function () {
        utils.print("    validate --input <input-file>");
    }
}

function validateBundle(obj) {
    for (const [entityName, entities] of Object.entries(obj)) {
        if (entityName == "services" || entityName == "policies") {
            validateEntities(entities)
        }
    }

}

function validateEntities(entities) {
    for (const entity of entities) {
        policyErrors = false
        utils.info("Validating policy of entity " + entity.name);
        validatePolicy(entity.policy)
        if (policyErrors) {
            utils.info("Invalid policy code");
        }
    }
}

function validatePolicy(policy) {
    if (policy.code) {
        validatePolicyCode(policy.code)
    } else if (policy.json) {
        validatePolicyCode(JSON.parse(policy.json))
    }
}

function validatePolicyCode(code) {
    if (Object.keys(code).length == 1 && Object.keys(code)[0] == "All") {
        validateAssertions(Object.values(code)[0])
    } else {
        utils.info("Given policy is invalid");
    }
}

function buildPolicySchema() {
    this.schemaValidator = policySchema.build();
}

function validateAssertions(assertionArray) {
    for (let i = 0; i < assertionArray.length; i++) {
        validateAssertion(assertionArray[i])
        const key = Object.keys(assertionArray[i])[0]
        if (key == "All" || key == "OneOrMore") {
            validateAssertions(Object.values(assertionArray[i])[0])
        }
    }
}

function validateAssertion(assertion) {
    const valid = this.schemaValidator(assertion)
    if (!valid) {
        error = true
        policyErrors = true
        utils.print(this.schemaValidator.errors)
    }
}