// Script to load the database with the admin and first users

print("Preparing to init authentication records in auth/users , if not done already");
//                ############
var conn = new Mongo("mongo"); // <= Connection string !! Caution !!
//                ############

var db = conn.getDB("auth");
try {
    db.users.insertOne({_id: "admin", password: "temp", roles: ['admins', 'users']});
    db.users.insertOne({_id: "user", password: "temp", roles: ['users']});
    print("Success. auth.users has been successfully initialized");
} catch (e) {
    print("Collection auth/users was already initialized");
}
