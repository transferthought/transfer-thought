/* eslint-disable  */
import _ from 'lodash';
import * as acorn from 'acorn';
import Client from '@/tt-api';

const matchTemplate = /{{([\s\S]+?)}}/g;
const templatesCache = new Map();

function stripTemplate(template = '') {
    if (template && template.match) {
        const matches = template.match(matchTemplate);
        if (matches && matches.length === 1) {
            const match = matches[0];
            return match.replace(/{{/g, '').replace(/}}/g, '');
        }
    }
    return null;
}

class Template {
    constructor(template) {
        this.template = template;
        this.strippedTemplate = stripTemplate(this.template);
        this.parsedTemplate = acorn.parse(this.strippedTemplate, { ecmaVersion: 2020 });
    }

    get isValid() {
        return this.strippedTemplate && this.strippedTemplate.length === this.template.length - 4;
    }

    /**
     * Run the passed in data through the parsed template
     * @returns {Array}
     */
    evaluate(data = {}) {
        try {
            const strippedTemplate = stripTemplate(this.template);
            if (strippedTemplate && strippedTemplate.length === this.template.length - 4) {
                const parameterKeys = _.keys(data);
                const parameterValues = _.values(data);
                const actionCode = `function func(${parameterKeys.join(', ')}){
                                        return ${strippedTemplate};
                                    }
                                    return func(${parameterKeys.join(', ')});`;
                // eslint-disable-next-line no-new-func
                const handler = new Function(...parameterKeys, actionCode);
                const result = handler(...parameterValues);
                return result;
            }
        } catch (err) {
            Client.Logger.info(err);
        }
        return null;
    }
}
class TemplateFactory {
    static isValidTemplateString(template) {
        const strippedTemplate = stripTemplate(template);
        return strippedTemplate && strippedTemplate.length === template.length - 4;
    }

    static buildTemplate(template) {
        if (!templatesCache.has(template)) {
            const newTemplate = new Template(template);
            if (newTemplate && newTemplate.isValid) {
                templatesCache.set(template, newTemplate);
            } else {
                templatesCache.set(template, null);
            }
        }
        return templatesCache.get(template);
    }
}

export default TemplateFactory;
