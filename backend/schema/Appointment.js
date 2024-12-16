class Appointment {
  constructor(data, appointmentId) {
    this.assignData(data); // Assign the provided data to the appointment object
  }

  // Function to assign the properties from the input data
  assignData(data) {
    const {
      clientId,
      name,
      address,
      phone,
      carLicense,
      carEngine,
      date,
      mechanicId,
    } = data;

    // Assign properties directly from the data to the schema
    this.clientId = clientId;
    this.name = name;
    this.address = address;
    this.phone = phone;
    this.carLicense = carLicense;
    this.carEngine = carEngine;
    this.date = new Date(date).toISOString(); // Normalize the date to ISO string
    this.mechanicId = mechanicId;
  }

  // Function to convert the Appointment object to a plain JavaScript object for storage
  toPlainObject() {
    return {
      clientId: this.clientId,
      name: this.name,
      address: this.address,
      phone: this.phone,
      carLicense: this.carLicense,
      carEngine: this.carEngine,
      date: this.date,
      mechanicId: this.mechanicId,
    };
  }
}

module.exports = Appointment;
