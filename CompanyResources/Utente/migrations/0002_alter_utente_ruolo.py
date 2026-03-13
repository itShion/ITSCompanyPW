from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('Utente', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='utente',
            name='ruolo',
            field=models.CharField(choices=[('UTENTE', 'utente'), ('RESPONSABILE', 'responsabile'), ('ADMIN', 'amministratore')], max_length=120),
        ),
    ]
