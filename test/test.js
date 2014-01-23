/*jshint expr:true */

var uevents = require('../uevents.js');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
var error = chai.AssertionError;

chai.use(sinonChai);

describe("basic", function () {
  var ctx = {};

  beforeEach(function () {
    ctx.obj = uevents.create();
    ctx.signal1_listener1 = new sinon.spy();
    ctx.signal1_listener2 = new sinon.spy();
    ctx.signal2_listener1 = new sinon.spy();
    ctx.signal2_listener2 = new sinon.spy();
    ctx.obj.on('signal1', ctx.signal1_listener1);
    ctx.obj.on('signal1', ctx.signal1_listener2);
    ctx.obj.on('signal2', ctx.signal2_listener1);
    ctx.obj.on('signal2', ctx.signal2_listener2);
  });

  it("on (without trigger)", function () {
    expect(ctx.signal1_listener1).not.to.be.called;
    expect(ctx.signal1_listener2).not.to.be.called;
    expect(ctx.signal2_listener1).not.to.be.called;
    expect(ctx.signal2_listener2).not.to.be.called;
  });

  it("on (with single trigger)", function () {
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledOnce;
    expect(ctx.signal1_listener2).to.be.calledOnce;
    expect(ctx.signal2_listener1).not.to.be.called;
    expect(ctx.signal2_listener2).not.to.be.called;
  });

  it("on (check context)", function () {
    ctx.obj.trigger("signal1");
    expect(ctx.signal1_listener1).to.be.calledOn(ctx.obj);
    expect(ctx.signal1_listener2).to.be.calledOn(ctx.obj);
  });

  it("on (with parameters)", function () {
    ctx.obj.trigger("signal1", "A", "B");
    expect(ctx.signal1_listener1).to.be.calledWithExactly("A", "B");
    expect(ctx.signal1_listener2).to.be.calledWithExactly("A", "B");
    ctx.obj.trigger("signal2", 2, 3, 4);
    expect(ctx.signal2_listener1).to.be.calledWithExactly(2, 3, 4);
    expect(ctx.signal2_listener2).to.be.calledWithExactly(2, 3, 4);
  });

  it("on (with multiple triggers)", function () {
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledOnce;
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledTwice;
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledThrice;
    expect(ctx.signal2_listener1).not.to.be.called;
    ctx.obj.trigger('signal2');
    expect(ctx.signal2_listener1).to.be.calledOnce;
    ctx.obj.trigger('signal2');
    expect(ctx.signal2_listener1).to.be.calledTwice;
  });

  it("off (remove all callbacks)", function () {
    ctx.obj.off('signal1');
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).not.to.be.called;
    expect(ctx.signal1_listener2).not.to.be.called;
  });

  it("off (remove one callback)", function () {
    ctx.obj.off('signal1', ctx.signal1_listener1);
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).not.to.be.called;
    expect(ctx.signal1_listener2).to.be.called;
  });
});

describe("extend", function () {
  var ctx = {};

  beforeEach(function () {
    ctx.obj = new Date();
    uevents.create(ctx.obj);
    ctx.signal1_listener1 = new sinon.spy();
    ctx.signal1_listener2 = new sinon.spy();
    ctx.signal2_listener1 = new sinon.spy();
    ctx.signal2_listener2 = new sinon.spy();
    ctx.obj.on('signal1', ctx.signal1_listener1);
    ctx.obj.on('signal1', ctx.signal1_listener2);
    ctx.obj.on('signal2', ctx.signal2_listener1);
    ctx.obj.on('signal2', ctx.signal2_listener2);
  });

  it("on (without trigger)", function () {
    expect(ctx.signal1_listener1).not.to.be.called;
    expect(ctx.signal1_listener2).not.to.be.called;
    expect(ctx.signal2_listener1).not.to.be.called;
    expect(ctx.signal2_listener2).not.to.be.called;
  });

  it("on (with single trigger)", function () {
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledOnce;
    expect(ctx.signal1_listener2).to.be.calledOnce;
    expect(ctx.signal2_listener1).not.to.be.called;
    expect(ctx.signal2_listener2).not.to.be.called;
  });

  // it("on (check context)", function () {
  //   ctx.obj.trigger("signal1");
  //   expect(ctx.signal1_listener1).to.be.calledOn(ctx.obj);
  //   expect(ctx.signal1_listener2).to.be.calledOn(ctx.obj);
  // });

  it("on (with parameters)", function () {
    ctx.obj.trigger("signal1", "A", "B");
    expect(ctx.signal1_listener1).to.be.calledWithExactly("A", "B");
    expect(ctx.signal1_listener2).to.be.calledWithExactly("A", "B");
    ctx.obj.trigger("signal2", 2, 3, 4);
    expect(ctx.signal2_listener1).to.be.calledWithExactly(2, 3, 4);
    expect(ctx.signal2_listener2).to.be.calledWithExactly(2, 3, 4);
  });

  it("on (with multiple triggers)", function () {
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledOnce;
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledTwice;
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).to.be.calledThrice;
    expect(ctx.signal2_listener1).not.to.be.called;
    ctx.obj.trigger('signal2');
    expect(ctx.signal2_listener1).to.be.calledOnce;
    ctx.obj.trigger('signal2');
    expect(ctx.signal2_listener1).to.be.calledTwice;
  });

  it("off (remove all callbacks)", function () {
    ctx.obj.off('signal1');
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).not.to.be.called;
    expect(ctx.signal1_listener2).not.to.be.called;
  });

  it("off (remove one callback)", function () {
    ctx.obj.off('signal1', ctx.signal1_listener1);
    ctx.obj.trigger('signal1');
    expect(ctx.signal1_listener1).not.to.be.called;
    expect(ctx.signal1_listener2).to.be.called;
  });
});
