# Deploying Viewcy-planner

## Deploy Requirements:
+ Bundler

## Pre-Deploy Requirements:
+ DevOps must ensure that your ssh public key exists in the authorized_keys for the user "cap" on the target server.
+ Alternatively, developers may execute "ssh-copy-id cap@<server>" where <server> is the name of the machine to which you will deploy
  (Note that this requires you to enter the password for the user "cap" DevOps has this and can provide it to developers as needed
  
# Instructions:

If you have't already, use bundler to install the capistrano gem.  Assumes Capitrano appears in your gemfile
> bundle install

Verify that you Capistrano tasks are available
> bundle exec cap -T

(Optional)
Verify that you are able to connect to the target server as the "cap" user
> bundle exec cap staging deploy:check

Full Deploy
> bundle exec cap staging deploy

Execute Capistrano tasks
> bundle exec cap <environment> <namespace:task>



