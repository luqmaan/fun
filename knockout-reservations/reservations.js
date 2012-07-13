// Class to represent a row in the seat reservations grid
function SeatReservation(name, initialMeal) {
    var self = this;
    self.name = name;
    self.meal = ko.observable(initialMeal);
    
    self.formattedPrice = ko.computed(function() {
        var price = self.meal().price;
        return price ? "$" + price.toFixed(2) :  "-";
    });

    self.shouldShow = ko.computed(function() {
        return self.meal().price !== 0;
    });
}

// Overall viewmodel for this screen, along with initial state
function ReservationsViewModel() {
    var self = this;

    // Non-editable catalog data - would come from the server
    self.availableMeals = [
        { mealName: "Standard (sandwich)", price: 0 },
        { mealName: "Premium (lobster)", price: 34.95 },
        { mealName: "Ultimate (whole zebra)", price: 290 }
    ];

    // Editable data
    self.seats = ko.observableArray([
        new SeatReservation("Steve", self.availableMeals[0]),
        new SeatReservation("John", self.availableMeals[2]),
        new SeatReservation("Bob", self.availableMeals[1]),
        new SeatReservation("David", self.availableMeals[0]),
        new SeatReservation("Bert", self.availableMeals[1])
    ]);

    self.newName = "Name";
    self.newMeal = "0";
    
    self.totalSurcharge = ko.computed(function() {
        var total = 0;
        for (var i = 0; i < self.seats().length; i++) {
            total += self.seats()[i].meal().price;
        }
        return total;
    });

    // Operations
    self.addSeat = function() {
        self.seats.push(new SeatReservation(self.newName, self.availableMeals[self.newMeal]));
    };
    self.removeSeat = function(seat) {
        self.seats.remove(seat);
    };
    
}

ko.applyBindings(new ReservationsViewModel());