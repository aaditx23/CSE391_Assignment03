class Appointment {
  constructor(data, appointmentId) {
    this.assignData(data); // Assign the provided data to the appointment object
  }

  // Function to assign the properties from the input data
  assignData(data) {
    const {
      name,
      address,
      phone,
      carLicense,
      carEngine,
      date,
      mechanicName,
    } = data;

    this.name = name;
    this.address = address;
    this.phone = phone;
    this.carLicense = carLicense;
    this.carEngine = carEngine;
    this.date = new Date(date).toISOString(); // Normalize the date to ISO string
    this.mechanicName = mechanicName;
  }

  toPlainObject() {
    return {
      name: this.name,
      address: this.address,
      phone: this.phone,
      carLicense: this.carLicense,
      carEngine: this.carEngine,
      date: this.date,
      mechanicName: this.mechanicName,
    };
  }
}

module.exports = Appointment;
