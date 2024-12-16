class Mechanic {
  constructor(data) {
    this.name = data.name;
    this.appointmentIds = data.appointmentIds || [];
  }

  // Convert the mechanic instance to a plain object
  toPlainObject() {
    return {
      name: this.name,
      appointmentIds: this.appointmentIds,
    };
  }
}

module.exports = Mechanic;
