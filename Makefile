# Запустить контейнеры в фоне
up:
	docker compose up -d

# Запустить контейнеры с пересборкой образов
rebuild:
	docker compose up -d --build

# Остановить контейнеры без удаления
stop:
	docker compose stop

# Полностью остановить и удалить контейнеры + сети
down:
	docker compose down

# Перезапустить контейнеры (с удалением)
restart:
	docker compose down && docker compose up -d

# Перезапустить контейнеры с пересборкой образов
rebuild-restart:
	docker compose down && docker compose up -d --build

# Посмотреть логи
logs:
	docker compose logs -f

# Посмотреть статус контейнеров
ps:
	docker compose ps
