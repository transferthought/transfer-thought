import TemplateFactory from '../Templates';

describe('TemplateFactory', () => {
    test('it should only validate templates with {{}}', () => {
        const template = TemplateFactory.buildTemplate('{{qwe}}');
        expect(template.isValid).toEqual(true);

        const template2 = TemplateFactory.buildTemplate('qwe');
        expect(template2).toEqual(null);
    });
    test('it should parse out state selectors into an array', () => {
        const template = TemplateFactory.buildTemplate('{{state.prop1 + state.prop2}}');
        const expectedSelectors = new Set(['state', 'state.prop1', 'state.prop2']);
        expect(template.selectors).toEqual(expectedSelectors);
    });
    test('it should parse out bracket selectors', () => {
        const template = TemplateFactory.buildTemplate('{{state.prop1 + state["prop2"] - state.prop1[0]}}');
        const expectedSelectors = new Set(['state', 'state.prop1', 'state["prop2"]', 'state.prop1[0]']);
        expect(template.selectors).toEqual(expectedSelectors);
    });
    test('evaluate should run math operations', () => {
        const template1 = TemplateFactory.buildTemplate('{{1 + 2}}');
        const result1 = template1.evaluate();
        expect(result1).toEqual(3);

        const template2 = TemplateFactory.buildTemplate('{{100 - 3}}');
        const result2 = template2.evaluate();
        expect(result2).toEqual(97);

        const template3 = TemplateFactory.buildTemplate('{{10 * 5}}');
        const result3 = template3.evaluate();
        expect(result3).toEqual(50);

        const template4 = TemplateFactory.buildTemplate('{{10 / 2}}');
        const result4 = template4.evaluate();
        expect(result4).toEqual(5);
    });
    test('evaluate should run boolean operations', () => {
        const template1 = TemplateFactory.buildTemplate('{{true || false}}');
        const result1 = template1.evaluate();
        expect(result1).toEqual(true);

        const template2 = TemplateFactory.buildTemplate('{{false || false}}');
        const result2 = template2.evaluate();
        expect(result2).toEqual(false);

        const template3 = TemplateFactory.buildTemplate('{{true && false}}');
        const result3 = template3.evaluate();
        expect(result3).toEqual(false);

        const template4 = TemplateFactory.buildTemplate('{{true && true}}');
        const result4 = template4.evaluate();
        expect(result4).toEqual(true);

        const template5 = TemplateFactory.buildTemplate('{{true && true && false}}');
        const result5 = template5.evaluate();
        expect(result5).toEqual(false);

        const template6 = TemplateFactory.buildTemplate('{{!true}}');
        const result6 = template6.evaluate();
        expect(result6).toEqual(false);

        const template7 = TemplateFactory.buildTemplate('{{!false}}');
        const result7 = template7.evaluate();
        expect(result7).toEqual(true);

        const template8 = TemplateFactory.buildTemplate('{{!!false}}');
        const result8 = template8.evaluate();
        expect(result8).toEqual(false);
    });
    test('evaluate should use passed in state variable', () => {
        const template = TemplateFactory.buildTemplate('{{state.prop1 + someVar}}');
        const result1 = template.evaluate({ state: { prop1: 1 }, someVar: 3 });
        expect(result1).toEqual(4);

        const result2 = template.evaluate({ state: { prop1: 1500 }, someVar: -500 });
        expect(result2).toEqual(1000);

        const result3 = template.evaluate({ state: { prop1: -60 }, someVar: 5 });
        expect(result3).toEqual(-55);

        const template2 = TemplateFactory.buildTemplate('{{!state.prop}}');
        const result4 = template2.evaluate({ state: { prop: true } });
        expect(result4).toEqual(false);

        const result5 = template2.evaluate({ state: { prop: false } });
        expect(result5).toEqual(true);
    });
});
