define('model.user',
    ['ko', 'config'],
    function (ko, config) {
        var
            _dc = null,
            
            settings = {
                imageBasePath: '../content/images/photos/',
                unknownUserImageSource: 'unknown_User.jpg'
            },
            
            User = function () {
                var self = this;
                self.id = ko.observable();
                self.firstName = ko.observable().extend({ required: true });
                self.lastName = ko.observable().extend({ required: true });
                self.fullName = ko.computed(function () {
                    return self.firstName() + ' ' + self.lastName();
                }, self);
                self.username = ko.observable();
                self.email = ko.observable().extend({ email: true });
                self.imageSource = ko.observable();
                self.imageName = ko.computed(function () {
                    var source = self.imageSource();
                    if (!source) {
                        source = settings.unknownUserImageSource;
                    }
                    return settings.imageBasePath + source;
                }, self);
                

                self.isNullo = false;

                self.dirtyFlag = new ko.DirtyFlag([
                    self.firstName,
                    self.lastName,
                    self.username,
                    self.email]);
                return self;
            };

        User.Nullo = new User()
            .id(0)
            .firstName('Not a')
            .lastName('User')
            .username('')
            .email('')
            .imageSource('')
        User.Nullo.isNullo = true;
        User.Nullo.dirtyFlag().reset();

        // static member
        User.datacontext = function (dc) {
            if (dc) { _dc = dc; }
            return _dc;
        };

        return User;
});