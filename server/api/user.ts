import * as express from 'express';

import * as _ from 'lodash';

import {User, UserFromAPI, Permission, Notification} from '../definitions/user';
import {CreateUser, DeleteUser} from '../definitions/user_actions';

import {getDB} from '../common/db';

var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  let email = req.query.email;
  let attributes = ['email', 'role', 'name', 'logins', 'createdAt', 'updatedAt', 'phone'];
  if(email) {
    return getDB().User.findOne({where: {email: email}, attributes: attributes}).then(function(user) {
      if(!user) {
        res.sendStatus(404);
      }
      else {
        user = new User(user as UserFromAPI);
        res.send(user);
      }
    })
  } else {
    getDB().User.findAll({attributes: attributes}).then(function(users) {
      let us =  _.map(users, function(user) {
        return new User(user as UserFromAPI);
      });
      res.send({"results": us})
    })
  }
});

router.post('/create', function(req, res, next) {
  let email = req.body.email;

  if(!email) {
    res.status(400).send({'status': 'error', 'message': 'No email supplied'})
  }

  let name = req.body.name;

  let createUser = {
    email: email,
    name: name
  } as CreateUser

  getDB().User.create(createUser).then(function(user) {
    res.send(user);
  }, function(err) {
    console.log("Error creating user! ", err);
    res.send({"message": err, "status": "error"});
  })
})

router.post('/delete', function(req, res, next) {
  let email = req.body.email;
  if(!email) {
    res.status(400).send({'status': 'error', 'message': 'No email supplied'})
  }

  let deleteUser = {
    email: email,
  } as DeleteUser

  getDB().User.destroy({
    where: deleteUser
  }).then(function(result) {
    res.send({status: result});
  }, function(err) {
    console.log("error deleting! ", err)
    res.send({status:false});
  })

})

// Get keys for a userID /user/keys/:uid?keys=location,name
router.get('/keys', function(req, res, next) {
  let email = req.query.email
  let keys = req.query.keys

  if(!email) {
    res.status(400).json({status: "error", "message": "no email supplied"})
  }

  if(typeof keys === "undefined" || keys.length === 0 || (keys.length === 1 && keys[0] === '')) {
    res.status(400).json({status: "error", message: "No keys supplied"})
  }

  keys = keys.split(',')

  getDB().User.findOne({where: {email: email}, attributes: ['data', 'email']}).then(function(user) {
    return _.pick(user.data, keys)
  }).then(function(result) {
    res.send({"result": result, "status": "ok"})
  }, function(err) {
    console.log("Error getting keys: ", err)
    res.send({"error": err, "status": "error"})
  })
})

// Set keys for a userID /user/keys/:uid
router.post('/keys', function(req, res, next) {
  let email = req.body.email;
  let keys = req.body.keys;

  if(!email) {
    res.status(400).json({status: "error", "message": "no email supplied"})
  }

  if(typeof keys === "undefined" || keys.length === 0 || (keys.length === 1 && keys[0] === '')) {
    res.status(400).json({status: "error", message: "No keys supplied"})
  }

  getDB().User.update({data: keys}, {where: {email: email}}).then(function(result) {
    res.send({"result": result, "status": "ok"})
  }, function(err) {
    res.send({"error": err, "status": "error"})
  })
})


let mockNotifications = [{
  email: 'shawnflahave@exosite.com',
  rid: '346257',
  sms: true,
  receive_email: true
}];

// user notifications
router.post('/notifications', function(req, res, next) {
  let email = req.body.email;
  let rid = req.body.rid || 'fake_rid';
  let sms = req.body.sms || true;
  let receive_email = req.body.receive_email || true;

  console.log("Setting user notifications: ", email, " body: ", req.body);

  if(email) {
    let existing = mockNotifications.filter( (notification) => {
       return notification.email === email;
    })[0];

    if(existing) {
      existing.email = email;
      existing.rid = rid;
      existing.sms = sms;
      existing.receive_email = receive_email;
    }
    else {
      mockNotifications.push({
        email: email,
        rid: rid,
        sms: sms,
        receive_email: receive_email
      });
    }
    res.send(mockNotifications);
  }
  else {
    res.sendStatus(400);
  }
});

router.get('/notifications', function(req, res, next) {
  let email = req.query.email;
  console.log("Getting user notifications: ", email);

  let existing = mockNotifications.filter( (notification) => {
    return notification.email === email;
  })[0];

  if(existing) {
    res.send(existing);
  }
  else {
    res.sendStatus(404);
  }
});

router.post('/roles', function(req, res, next) {
  let uid = req.body.uid;
  console.log("Setting user role: ", uid, " body: ", req.body);

  res.send(true);
});

router.post('/permissions/:uid', function(req, res, next) {
  let uid = req.body.uid;
  console.log("Setting user permissions: ", uid, " body: ", req.body);

  res.send(true);
})

export = router;
