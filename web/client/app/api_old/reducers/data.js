let devices = [
  {
    rid: "1234321234",
    data: {
      "activity_log": [
        {"user": "test@example.com", "text": "I turned it on", "timestamp": 12321}
      ]
    }
  }
]

let users = [
  {"email": "test@example.com", "role": "manager"},
  {"email": "test2@example.com", "role": "guest"}
]

export { devices, users }
