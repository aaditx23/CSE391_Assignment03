
class Client {
  constructor(data) {
    this.assignData(data);
  }

  assignData(data) {
    const { email, name, password, appointmentIds } = data;

    // Assign properties without validation
    this.email = email;
    this.name = name;
    this.password = password;
    this.appointmentIds = appointmentIds || [];
  }

  toPlainObject() {
    return {
      email: this.email,
      name: this.name,
      password: this.password,
      appointmentIds: this.appointmentIds,
    };
  }
}

module.exports = Client;
