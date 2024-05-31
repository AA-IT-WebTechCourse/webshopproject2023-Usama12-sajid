from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from webshop_project.models import Item

class Command(BaseCommand):
    help = 'Populates the database with users and items'

    def handle(self, *args, **kwargs):
        User.objects.all().delete()
        Item.objects.all().delete()

        users = []
        items = []

        for i in range(1, 7):
            username = f"testuser{i}"
            email = f"testuser{i}@shop.aa"
            password = "pass#"
            user = User(username=username, email=email)
            user.set_password(password)
            users.append(user)

        User.objects.bulk_create(users)

        for i, user in enumerate(User.objects.all(), start=1):
            if i <= 3:
                for j in range(1, 11):
                    items.append(Item(
                        title=f"Item#{j} by {user.username}",
                        description=f"Item#{j} by {user.username}",
                        price=5.0,
                        seller=user
                    ))

        Item.objects.bulk_create(items)

        self.stdout.write(self.style.SUCCESS("Database populated successfully"))
