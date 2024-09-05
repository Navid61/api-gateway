import { loadPackageDefinition, credentials } from '@grpc/grpc-js';
import protoLoader from '@grpc/proto-loader';
import path from 'path';
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PROTO_PATH = path.join(__dirname, '../../shared/proto/geo_service.proto');
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const protoDescriptor = loadPackageDefinition(packageDefinition);
const geomap = protoDescriptor.geomap;
const geoClient = new geomap.GeoService('localhost:50052', credentials.createInsecure());
// Function to check if a client is ready
function checkClientReady(client, deadline) {
    return new Promise((resolve, reject) => {
        client.waitForReady(deadline, (error) => {
            if (error) {
                console.error("Client connection error:", error);
                reject(error);
            }
            else {
                console.log("Client is ready");
                resolve();
            }
        });
    });
}
async function initializeClients() {
    try {
        const deadline = new Date().setSeconds(new Date().getSeconds() + 5); // 5 seconds timeout
        await Promise.all([
            checkClientReady(geoClient, deadline)
        ]);
        console.log("micro-geo client is ready");
    }
    catch (error) {
        console.error("Failed to connect to one or more services:", error);
        throw error; // Stop further execution if connection fails
    }
}
function getGeoUserData(userId) {
    return new Promise((resolve, reject) => {
        geoClient.GetGeoUserData({ user_id: userId }, (error, response) => {
            if (error) {
                console.error('Error getting geo user data:', error);
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
}
// Initialize clients on module load
initializeClients().catch((error) => {
    console.error("Initialization failed:", error);
});
export { initializeClients, getGeoUserData };
