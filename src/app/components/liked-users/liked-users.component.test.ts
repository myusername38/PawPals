const likedUsers = require("./liked-users.component"); 

test('makes sure shortenMessage() functions', () => {
    expect(likedUsers.shortenMessage("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse eros quam, vulputate at porttitor quis, bibendum quis risus. Quisque sit amet placerat nibh. Suspendisse aliquet commodo suscipit. Donec a vestibulum urna. Sed mattis egestas erat. Suspendisse facilisis odio sed ipsum sodales fermentum. Ut turpis magna, semper id mattis nec, tempus a dolor. Nunc consequat ipsum sit amet tellus scelerisque pellentesque. Praesent id ultricies ex. Curabitur turpis leo, volutpat quis risus id, dictum pharetra magna. Sed suscipit elementum tortor in malesuada. Proin diam nibh, interdum nec accumsan porta, feugiat ac tortor. Morbi eget ex nec velit venenatis maximus ac quis nisi. Proin velit leo, pulvinar nec sem vel, vulputate tristique erat.")).toBe("Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse e..."); 
}); 
