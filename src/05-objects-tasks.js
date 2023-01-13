/* ************************************************************************************************
 *                                                                                                *
 * Please read the following tutorial before implementing tasks:                                   *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Object_initializer *
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object        *
 *                                                                                                *
 ************************************************************************************************ */

/**
 * Returns the rectangle object with width and height parameters and getArea() method
 *
 * @param {number} width
 * @param {number} height
 * @return {Object}
 *
 * @example
 *    const r = new Rectangle(10,20);
 *    console.log(r.width);       // => 10
 *    console.log(r.height);      // => 20
 *    console.log(r.getArea());   // => 200
 */
function Rectangle(width, height) {
  return {
    width,
    height,
    getArea() {
      return width * height;
    },
  };
}

/**
 * Returns the JSON representation of specified object
 *
 * @param {object} obj
 * @return {string}
 *
 * @example
 *    [1,2,3]   =>  '[1,2,3]'
 *    { width: 10, height : 20 } => '{"height":10,"width":20}'
 */
function getJSON(obj) {
  return JSON.stringify(obj);
}

/**
 * Returns the object of specified type from JSON representation
 *
 * @param {Object} proto
 * @param {string} json
 * @return {object}
 *
 * @example
 *    const r = fromJSON(Circle.prototype, '{"radius":10}');
 *
 */
function fromJSON(proto, json) {
  const object = JSON.parse(json);
  const values = Object.values(object);
  return new proto.constructor(...values);
}

/**
 * Css selectors builder
 *
 * Each complex selector can consists of type, id, class, attribute, pseudo-class
 * and pseudo-element selectors:
 *
 *    element#id.class[attr]:pseudoClass::pseudoElement
 *              \----/\----/\----------/
 *              Can be several occurrences
 *
 * All types of selectors can be combined using the combination ' ','+','~','>' .
 *
 * The task is to design a single class, independent classes or classes hierarchy
 * and implement the functionality to build the css selectors using the provided cssSelectorBuilder.
 * Each selector should have the stringify() method to output the string representation
 * according to css specification.
 *
 * Provided cssSelectorBuilder should be used as facade only to create your own classes,
 * for example the first method of cssSelectorBuilder can be like this:
 *   element: function(value) {
 *       return new MySuperBaseElementSelector(...)...
 *   },
 *
 * The design of class(es) is totally up to you, but try to make it as simple,
 * clear and readable as possible.
 *
 * @example
 *
 *  const builder = cssSelectorBuilder;
 *
 *  builder.id('main').class('container').class('editable').stringify()
 *    => '#main.container.editable'
 *
 *  builder.element('a').attr('href$=".png"').pseudoClass('focus').stringify()
 *    => 'a[href$=".png"]:focus'
 *
 *  builder.combine(
 *      builder.element('div').id('main').class('container').class('draggable'),
 *      '+',
 *      builder.combine(
 *          builder.element('table').id('data'),
 *          '~',
 *           builder.combine(
 *               builder.element('tr').pseudoClass('nth-of-type(even)'),
 *               ' ',
 *               builder.element('td').pseudoClass('nth-of-type(even)')
 *           )
 *      )
 *  ).stringify()
 *    => 'div#main.container.draggable + table#data ~ tr:nth-of-type(even)   td:nth-of-type(even)'
 *
 *  For more examples see unit tests.
 */

const cssSelectorBuilder = {
  answer: '',
  selectors: '',
  errorMessage:
    'Element, id and pseudo-element should not occur more then one time inside the selector',
  errorOrderMessage:
    'Selector parts should be arranged in the following order: element, id, class, attribute, pseudo-class, pseudo-element',

  element: function element(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.answer = this.answer + value;
    obj.type = 1;
    if (this.selectors.includes(obj.type)) {
      throw new Error(this.errorMessage);
    }
    if (this.selectors.slice(-1) > obj.type) {
      throw new Error(this.errorOrderMessage);
    }
    obj.selectors = `${this.selectors}${obj.type}`;
    return obj;
  },

  id: function id(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.answer = `${this.answer}#${value}`;
    obj.type = 2;
    if (this.selectors.includes(obj.type)) {
      throw new Error(this.errorMessage);
    }
    if (this.selectors.slice(-1) > obj.type) {
      throw new Error(this.errorOrderMessage);
    }
    obj.selectors = `${this.selectors}${obj.type}`;
    return obj;
  },

  class: function functionClass(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.answer = `${this.answer}.${value}`;
    obj.type = 3;
    if (this.selectors.slice(-1) > obj.type) {
      throw new Error(this.errorOrderMessage);
    }
    obj.selectors = `${this.selectors}${obj.type}`;
    return obj;
  },

  attr: function attr(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.answer = `${this.answer}[${value}]`;
    obj.type = 4;
    if (this.selectors.slice(-1) > obj.type) {
      throw new Error(this.errorOrderMessage);
    }
    obj.selectors = `${this.selectors}${obj.type}`;
    return obj;
  },

  pseudoClass: function pseudoClass(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.answer = `${this.answer}:${value}`;
    obj.type = 5;
    if (this.selectors.slice(-1) > obj.type) {
      throw new Error(this.errorOrderMessage);
    }
    obj.selectors = `${this.selectors}${obj.type}`;
    return obj;
  },

  pseudoElement: function pseudoElement(value) {
    const obj = Object.create(cssSelectorBuilder);
    obj.answer = `${this.answer}::${value}`;
    obj.type = 6;
    if (this.selectors.includes(obj.type)) {
      throw new Error(this.errorMessage);
    }
    if (this.selectors.slice(-1) > obj.type) {
      throw new Error(this.errorOrderMessage);
    }
    obj.selectors = `${this.selectors}${obj.type}`;
    return obj;
  },

  stringify: function stringify() {
    return this.answer;
  },

  combine: function combine(selector1, combinator, selector2) {
    const obj = Object.create(cssSelectorBuilder);
    obj.answer = `${selector1.answer} ${combinator} ${selector2.answer}`;
    return obj;
  },
};

module.exports = {
  Rectangle,
  getJSON,
  fromJSON,
  cssSelectorBuilder,
};
