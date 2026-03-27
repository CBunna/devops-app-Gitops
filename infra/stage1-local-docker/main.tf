terraform {
  required_providers {
    docker = {
      source  = "kreuzwerker/docker"
      version = "~> 3.0"
    }
  }
}

provider "docker" {
  host = "unix:///var/run/docker.sock"
}

# Pull the image
resource "docker_image" "app_image" {
  name = var.docker_image
}

# Create the container
resource "docker_container" "app_container" {
  image = docker_image.app_image.image_id
  name  = var.container_name
  ports {
    internal = var.internal_port
    external = var.external_port
  }

  # Restart policy for a "production-lite" feel
  restart = "unless-stopped"


}




