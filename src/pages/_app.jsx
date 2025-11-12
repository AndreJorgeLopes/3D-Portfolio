import { useEffect } from "react";
import "./index.css";
import { getAssetPath } from "../utils/getAssetPath";

const MODEL_PATHS = ["/desktop_pc/scene.glb", "/planet/scene.glb"];

function MyApp({ Component, pageProps }) {
  useEffect(() => {
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          getAssetPath("/sw.js"),
          {
            scope: getAssetPath("/"),
          }
        );

        // Handle updates
        registration.addEventListener("updatefound", () => {
          const newWorker = registration.installing;
          newWorker.addEventListener("statechange", () => {
            if (
              newWorker.state === "installed" &&
              navigator.serviceWorker.controller
            ) {
              newWorker.postMessage("SKIP_WAITING");
            }
          });
        });

        // Handle controller change with debouncing to prevent reload loops
        let reloading = false;
        navigator.serviceWorker.addEventListener("controllerchange", () => {
          if (!reloading) {
            reloading = true;
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }
        });
      } catch (error) {
        console.error("Service worker registration failed:", error);
      }
    };

    const preloadModels = async () => {
      const models = MODEL_PATHS.map(getAssetPath);

      if (!("caches" in window)) return;

      const cache = await caches.open("3d-portfolio-cache-v1");

      for (const model of models) {
        try {
          const cached = await cache.match(model);

          if (cached) {
            continue;
          }

          const response = await fetch(model);
          if (response.ok) {
            await cache.put(model, response);
          }
        } catch (error) {
          console.error(`Failed to preload model ${model}:`, error);
        }
      }
    };

    // Only run on client side
    if (typeof window !== "undefined") {
      // Register SW if supported
      if ("serviceWorker" in navigator) {
        window.addEventListener("load", registerServiceWorker);
      }

      // Start preloading models
      preloadModels();

      // Request persistent storage for better caching
      if (navigator.storage && navigator.storage.persist) {
        navigator.storage.persist().then((isPersisted) => {
          if (isPersisted) {
            console.log(
              "Storage will not be cleared except by explicit user action"
            );
          }
        });
      }
    }
  }, []);

  return <Component {...pageProps} />;
}

export default MyApp;
