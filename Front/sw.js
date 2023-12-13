importScripts('https://cdn.jsdelivr.net/npm/pouchdb@8.0.1/dist/pouchdb.min.js');
importScripts('/assets/js/sw-utils.js');

const STATIC_CACHE = "static-v1";
const INMUTABLE_CACHE = 'inmutablev1';
const DYNAMIC_CACHE = 'dynamicv1';
let pendingPostRequests = [];
const DB_NAME = 'pendingPostRequestsDB';
const STORE_NAME = 'pendingPostRequests';

const APP_SHELL = [
    "/",
    "/pages/admin/administradores/administradores.html",
    "/pages/admin/productos/productos.html",
    "/pages/admin/repartidores/repartidores.html",
    "/pages/admin/stores/stores.html",
    "/pages/admin/stores/store.html",
    "/pages/admin/visitas/visitas.html",
    "/pages/admin/admin.html",
    "/pages/pedidos/pedidos.html",
    "/pages/pedidos/resumen.html",
    "/pages/productos/productos.html",
    "/pages/repartidor/deliver.html",
    "/pages/repartidor/visitas/visitas.html",
    "/pages/repartidor/stores/stores.html",
    "/pages/repartidor/stores/store.html",
    "/pages/repartidor/pedidos/pedidos.html",
    "/pages/repartidor/pedidos/resumen.html",
    "/pages/repartidores/repartidores.html",
    "/pages/stores/stores.html",
    "/pages/stores/store.html",
    "/pages/visitas/visitas.html",
    "index.html",
    "assets/js/auth/auth.js",
    "assets/js/axios/axios-intance.js",
    "assets/js/delivers/delivers.js",
    "assets/js/native-resources/camera-class.js",
    "assets/js/orders/orderRegister.js",
    "assets/js/orders/orders.js",
    "assets/js/products/products.js",
    "assets/js/store/stores.js",
    "assets/js/sweetAlert/sweetalert2.all.min.js",
    "assets/js/visits/visits.js"
];

const APP_SHELL_INMUTABLE = [
    "/fragments/nav.html",
    "assets/images/logo.png",
    "assets/images/logo-blanco.png",
    "assets/images/bg-login.png",
    "assets/images/paletas.png",
    "assets/images/avatar.png",
    "assets/css/styles.css",
    "assets/css/bootstrap.min.css",
    "assets/css/sweetalert2.min.css",
    "assets/js/main2.js",
    "assets/js/axios.min.js",
    "assets/js/jquery-3.7.1.min.js",
    "assets/images/adminAvatar.png"
];

const openDB = () => {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, 1);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;
            db.createObjectStore(STORE_NAME, { autoIncrement: true });
        };

        request.onsuccess = () => {
            const db = request.result;
            resolve(db);
        };

        request.onerror = (event) => {
            reject(new Error('Error opening database'));
        };
    });
};

self.addEventListener("install", (e) => {
    console.log('Instalando');
    const staticCache = caches.open(STATIC_CACHE).then((cache) => {
        cache.addAll(APP_SHELL);
    });
    const inmutableCache = caches.open(INMUTABLE_CACHE).then((cache) => {
        cache.addAll(APP_SHELL_INMUTABLE)
    });
    e.waitUntil(Promise.all([staticCache, inmutableCache]));
    //e.skipWaiting();});
});

self.addEventListener('activate', (e) => {
    const clearCache = caches.keys().then((keys) => {
        keys.forEach((key) => {
            if (key != STATIC_CACHE && key.includes('static')) {
                return caches.delete(key);
            }
        });
        keys.forEach((key) => {
            if (key != DYNAMIC_CACHE && key.includes('dynamic')) {
                return caches.delete(key);
            }
        });
    })
    e.waitUntil(clearCache);
});

self.addEventListener('fetch', (event) => {
    if (event.request.method === 'POST') {
        event.respondWith(handlePostRequest(event.request));
    } else {
        event.respondWith(handleGetRequest(event.request));
    }
});

//   f (requestUrl.indexOf("/api/store/") >= 0) {
//     console.log("La solicitud se refiere a /api/store/");
//     return networkRes.clone();  // Agrega paréntesis a networkRes.clone
// } else {
//     console.log("La solicitud No se refiere a /api/store/");
//     return networkRes
// }
// Función para manejar solicitudes GET
const handleGetRequest = (request) => {
    return caches.open(DYNAMIC_CACHE).then((cache) => {
        return fetch(request)
            .then((networkRes) => {
                // Actualizar la caché con la nueva respuesta de red
                cache.put(request, networkRes.clone());

                // Devolver la respuesta de red al cliente
                return networkRes.clone();
            })
            .catch((error) => {
                console.error('Fetch error:', error);

                // Si el error es específicamente por una red no disponible, intentar obtener la respuesta desde la caché
                if (error.message === 'Failed to fetch') {
                    console.log("Intentando obtener desde la caché después de un error de red");
                    return cache.match(request)
                        .then((cacheRes) => {
                            if (cacheRes) {
                                // Si hay una respuesta en la caché, devolverla al cliente
                                console.log("Respondiendo desde la caché");
                                return cacheRes.clone();
                            }
                        });
                }

                // Otros tipos de errores, devolver una respuesta de fallback o generar una respuesta de error
                console.log("No hay respuesta en la caché, respondiendo con fallback o error");
                return new Response('Error en la solicitud GET.');
            });
    });
};


const handlePostRequest = (request) => {
    // Intentar realizar la solicitud POST
    console.log(request);
    setTimeout(() => {
        // Resto de tu código aquí
    }, 4000);
    return fetch(request.clone()).then((networkRes) => {
        if (!networkRes.ok) {
            throw new Error('Network request failed');
        }

        // Si la solicitud POST tiene éxito, puedes hacer algo con la respuesta si es necesario
        return networkRes;
    }).catch((error) => {
        // Si ocurre un error en la solicitud POST, manejarlo aquí
        console.error('Fetch error:', error);

        // Almacenar la solicitud POST en la cola para reintentar más tarde
        return storePostRequest(request.clone()).then(() => {
            // Devolver una respuesta específica para las solicitudes POST si lo deseas
            return new Response('Solicitud POST almacenada para enviar más tarde.');
        });
    });
};

const storePostRequest = (request) => {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const requestInfo = {
                url: request.url,
                method: request.method,
                headers: {},
            };

            request.headers.forEach((value, key) => {
                requestInfo.headers[key] = value;
            });

            const addRequest = store.add(requestInfo);

            addRequest.onsuccess = () => {
                resolve();
            };

            addRequest.onerror = () => {
                reject(new Error('Error adding request to IndexedDB'));
            };
        });
    });
};


self.addEventListener('sync', (event) => {
    if (event.tag === 'syncPostRequests') {
        event.waitUntil(sendStoredPostRequests());
    }
});

const sendStoredPostRequests = () => {
    return openDB().then((db) => {
        return new Promise((resolve, reject) => {
            const transaction = db.transaction(STORE_NAME, 'readwrite');
            const store = transaction.objectStore(STORE_NAME);

            const getRequest = store.openCursor();

            const sendRequests = [];

            getRequest.onsuccess = (event) => {
                const cursor = event.target.result;
                if (cursor) {
                    const storedRequestInfo = cursor.value;
                    const storedRequest = new Request(storedRequestInfo.url, {
                        method: storedRequestInfo.method,
                        headers: new Headers(storedRequestInfo.headers),
                    });

                    const sendRequest = fetch(storedRequest)
                        .then(() => {
                            // Eliminar la solicitud de la cola después de enviarla con éxito
                            const deleteRequest = store.delete(cursor.primaryKey);
                            deleteRequest.onsuccess = () => {
                                console.log('Request removed from IndexedDB:', storedRequestInfo);
                            };
                        })
                        .catch((error) => {
                            console.error('Error sending stored request:', error);
                        });

                    sendRequests.push(sendRequest);

                    cursor.continue();
                } else {
                    resolve(Promise.all(sendRequests));
                }
            };

            getRequest.onerror = () => {
                reject(new Error('Error opening cursor for IndexedDB'));
            };
        });
    });
};
// Después de realizar una operación que modifica los datos
self.clients.matchAll().then((clients) => {
    clients.forEach((client) => {
        client.postMessage({ action: 'reloadData' });
    });
});
