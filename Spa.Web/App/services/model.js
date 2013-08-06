define(
    function () {
    var
        Post = function (dto) {
            var id = ko.observable(dto.Id),
                title = ko.observable(dto.Title),
                contentText = ko.observable(dto.ContentText),
                tags = ko.observableArray();

            dto.Tags.forEach(function (item) {
                tags.push(new Tag(item));
            });

            tags = ko.observableArray(dto.Tags)

            return{
                id: id,
                title: title,
                contentText: contentText,
                tags: tags
            }
        },

        Tag = function (dto) {
            var self = this;
            self.name = ko.observable(dto.Name);
            return self
        };

    return {
        Post: Post,
        Tag: Tag
    };
});