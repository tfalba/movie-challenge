from fabric.api import local

def deploy():
   local('pip freeze > requirements.txt')
   local('git add .')
   print("enter your git commit comment: ")
   comment = input()
   local('git commit -m "%s"' % comment)
   local('git push -u origin main')
   local('heroku maintenance:on')
   local('git push heroku main')
   local('heroku maintenance:off')

# Requires import of fabric3 in virtual env
# To execute type 'fab deploy' without the ''.