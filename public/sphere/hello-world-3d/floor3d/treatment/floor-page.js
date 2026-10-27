/*
 * SphereFloor WebGL page: starts the scene and relays sphere-floor-bridge/1 messages.
 *
 * The embedding page (team app or theater) hands the scene the record to show and drives
 * its clock; the scene reports back. Only the parent window, and only from this page's own
 * origin, is heard. A top-level page (the verifier) can call sphereFloorPage.send directly.
 * Messages:
 *   page -> scene  {bridge, type: "load", name, frames} | "clock" {t, playing, speed} | "view" {n} | "tour" {on}
 *                  | "select" {id} | "walk" {on} | "quality" {level: "low" | "high"}
 *   scene -> page  {bridge, type: "ready"} | "state" {t, paused, ready, name, error} | "pick" {id} | "error" {text}
 */
(function () {
  "use strict";
  var BRIDGE = "sphere-floor-bridge/1";
  var canvas = document.getElementById("unity-canvas");
  var bar = document.getElementById("bar");
  var embedded = window.parent !== window;
  var unity = null;
  var sceneReady = false;
  var queue = [];

  function toPage(message) {
    window.sphereFloorLast = message;
    if (message.type === "state") window.sphereFloorState = message;
    if (embedded) window.parent.postMessage(message, window.location.origin);
  }

  function deliver(m) {
    if (m.type === "load") unity.SendMessage("FloorRemote", "Load", JSON.stringify({ name: m.name || "", frames: m.frames }));
    else if (m.type === "clock") unity.SendMessage("FloorRemote", "Clock", JSON.stringify({ t: Number(m.t) || 0, playing: !!m.playing, speed: Number(m.speed) || 1 }));
    else if (m.type === "view") unity.SendMessage("FloorRemote", "View", String(m.n));
    else if (m.type === "tour") unity.SendMessage("FloorRemote", "Tour", m.on ? "1" : "0");
    else if (m.type === "select") unity.SendMessage("FloorRemote", "Select", String(m.id || ""));
    else if (m.type === "walk") unity.SendMessage("FloorRemote", "Walk", m.on ? "1" : "0");
    else if (m.type === "quality") unity.SendMessage("FloorRemote", "Quality", m.level === "low" ? "low" : "high");
  }

  function flush() {
    if (!unity || !sceneReady) return;
    var pending = queue;
    queue = [];
    pending.forEach(deliver);
  }

  function toScene(m) {
    if (!m || m.bridge !== BRIDGE || typeof m.type !== "string") return;
    if (unity && sceneReady) { deliver(m); return; }
    // Before the scene is up keep only the latest record and the latest clock.
    queue = queue.filter(function (q) { return q.type !== m.type || (m.type !== "load" && m.type !== "clock"); });
    queue.push(m);
  }

  window.sphereFloorPage = {
    fromScene: function (m) {
      if (m.type === "ready") { sceneReady = true; flush(); }
      toPage(m);
    },
    send: toScene,
  };

  window.addEventListener("message", function (event) {
    if (event.source !== window.parent || event.origin !== window.location.origin) return;
    toScene(event.data);
  });

  var d = canvas.dataset;
  createUnityInstance(canvas, {
    dataUrl: d.data, frameworkUrl: d.framework, codeUrl: d.code, streamingAssetsUrl: "StreamingAssets",
    companyName: "iotrustlab", productName: d.product, productVersion: "1", devicePixelRatio: 1,
  }, function (progress) { bar.style.transform = "scaleX(" + progress + ")"; })
    .then(function (instance) {
      unity = instance;
      window.alpineUnity = instance; // the verification probe's SendMessage handle
      bar.remove();
      flush();
    })
    .catch(function (error) { toPage({ bridge: BRIDGE, type: "error", text: String(error) }); });
})();
