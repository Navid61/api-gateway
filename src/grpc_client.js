import { loadPackageDefinition, credentials } from "@grpc/grpc-js";
import protoLoader from "@grpc/proto-loader";
import path from "path";
const __dirname = path.dirname(new URL(import.meta.url).pathname);
const PROTO_PATH = path.join(__dirname, "../../shared/proto/service.proto");
const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true,
});
const protoDescriptor = loadPackageDefinition(packageDefinition);
const mypackage = protoDescriptor.mypackage;
const client = new mypackage.MyService("localhost:50051", credentials.createInsecure());
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
            checkClientReady(client, deadline),
        ]);
        console.log("user-account client is ready");
    }
    catch (error) {
        console.error("Failed to connect to one or more services:", error);
        throw error; // Stop further execution if connection fails
    }
}
async function getUserData(userId) {
    return new Promise((resolve, reject) => {
        client.GetUserData({ user_id: userId }, (error, response) => {
            if (error) {
                console.error("Error getting user data:", error);
                reject(error);
            }
            else {
                resolve(response);
            }
        });
    });
}
async function saveUser(name, age) {
    return new Promise((resolve, reject) => {
        client.SaveUser({ name, age }, (error, response) => {
            if (error) {
                console.error("Error saving user:", error);
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
export { initializeClients, getUserData, saveUser };
