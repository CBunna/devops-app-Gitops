variable "container_name" {
  description = "The name of docker container"
  type        = string
  default     = "production_web_server"
}

variable "docker_image" {
  description = "The docker image to pull"
  type        = string
}

variable "internal_port" {
  description = "The internal port of the container"
  type        = number
  default     = 80
}

variable "external_port" {
  description = "The external port of the container"
  type        = number
  default     = 8080
}
