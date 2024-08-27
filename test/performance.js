import http from 'k6/http';
import { check, sleep } from 'k6';

// Define load testing options
export const options = {
    stages: [
        { duration: '10s', target: 100 }, // Ramp up to 10 users over 10 seconds
        { duration: '30s', target: 10 }, // Stay at 10 users for 30 seconds
        { duration: '10s', target: 0 }   // Ramp down to 0 users over 10 seconds
    ],
};

const BASE_URL = 'https://action-planner-backend.onrender.com/api/v1';

export default function () {
    let userId = '1'; // Replace with a valid user ID

    // Example GET request
    // let res = http.get(`${BASE_URL}/items?id=${userId}`);
    // check(res, {
    //     'is status 200': (r) => r.status === 200,
    //     'response contains todos': (r) => r.json().length >= 0,
    // });

    // sleep(1); // Pause for 1 second

    // Example POST request
    // let payload = JSON.stringify({
    //     user_id: userId,
    //     todos: [
    //         { id: 'new-todo-id', todoText: 'New Todo Item', isDone: false }
    //     ]
    // });
    // res = http.post(`${BASE_URL}/items`, payload, {
    //     headers: { 'Content-Type': 'application/json' },
    // });
    // check(res, {
    //     'is status 200': (r) => r.status === 200,
    // });

    sleep(1); // Pause for 1 second

    let updatePayload = JSON.stringify({
        user_id: userId,
        todo_id: 'new-todo-id',
        isDone: true
    });

    // Perform the PUT request
    let res = http.put(`${BASE_URL}/items`, updatePayload, {
        headers: { 'Content-Type': 'application/json' },
    });

    // Validate the response
    check(res, {
        'is status 200': (r) => r.status === 200,
    });


    // sleep(1); // Pause for 1 second

    // Example DELETE request
    // res = http.del(`${BASE_URL}/items/new-todo-id`, { user_id: userId }, {
    //     headers: { 'Content-Type': 'application/json' },
    // });
    // check(res, {
    //     'is status 200': (r) => r.status === 200,
    // });

    sleep(1); // Pause for 1 second
}
