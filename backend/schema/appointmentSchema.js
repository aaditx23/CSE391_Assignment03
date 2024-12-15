class AppointmentSchema {
    constructor(data) {
      // Validate and assign values using a method for clarity
      this.validateAndAssign(data);
    }
  
    validateAndAssign(data) {
      const { 
        clientId, name, address, phone, carLicense, carEngine, date, mechanicId 
      } = data;
  
      // Validation checks
      this.validateClientId(clientId);
      this.validateName(name);
      this.validateAddress(address);
      this.validatePhone(phone);
      this.validateCarLicense(carLicense);
      this.validateCarEngine(carEngine);
      this.validateDate(date);
      this.validateMechanicId(mechanicId);
  
      // Assign validated properties
      this.clientId = clientId;
      this.name = name;
      this.address = address;
      this.phone = phone;
      this.carLicense = carLicense;
      this.carEngine = carEngine;
      this.date = new Date(date).toISOString(); // Normalize the date to ISO string
      this.mechanicId = mechanicId;
    }
  
    // Validation methods
    validateClientId(clientId) {
      if (!clientId || typeof clientId !== "string") throw new Error("Invalid clientId");
    }
  
    validateName(name) {
      if (!name || typeof name !== "string") throw new Error("Invalid name");
    }
  
    validateAddress(address) {
      if (!address || typeof address !== "string") throw new Error("Invalid address");
    }
  
    validatePhone(phone) {
      if (!phone || !/^\d{10}$/.test(phone)) throw new Error("Invalid phone number");
    }
  
    validateCarLicense(carLicense) {
      if (!carLicense || typeof carLicense !== "string") throw new Error("Invalid carLicense");
    }
  
    validateCarEngine(carEngine) {
      if (!carEngine || typeof carEngine !== "string") throw new Error("Invalid carEngine");
    }
  
    validateDate(date) {
      if (!date || isNaN(Date.parse(date))) throw new Error("Invalid date");
    }
  
    validateMechanicId(mechanicId) {
      if (!mechanicId || typeof mechanicId !== "string") throw new Error("Invalid mechanicId");
    }
  }
  
  module.exports = AppointmentSchema;
  