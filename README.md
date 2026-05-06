# Self-Healing Distributed Event Platform

## Overview

Self-Healing Distributed Event Platform is a microservices-based backend system designed to simulate resilient distributed architecture using Spring Boot. The project focuses on fault tolerance, automated recovery, service communication, and scalable backend design.

This platform is being developed to demonstrate:

* Distributed systems architecture
* Microservices communication
* Service resilience and recovery
* Event-driven backend concepts
* Docker and Kubernetes deployment

---

# Current Microservices

## 1. Authentication Service

Handles:

* User Registration
* User Login
* JWT Authentication
* Spring Security Configuration

### Tech Stack

* Spring Boot
* Spring Security
* JWT
* PostgreSQL

---

## 2. User Service

Handles:

* User Profile Management
* User Information APIs
* User Data Persistence

### Features

* Create User
* Update User
* Fetch User Details

---

## 3. Order Service

Handles:

* Order Creation
* Order Management
* Order Tracking

### Features

* Create Orders
* Fetch Orders
* Order Status Management

---

# Planned Services

## Payment Service

Will include:

* Payment Processing
* Transaction Status
* Retry & Fallback Mechanisms

## API Gateway

Will handle:

* Centralized Routing
* Authentication Filters
* Request Management

## Monitoring & Recovery Service

Will monitor:

* Service Health
* Failure Detection
* Auto Recovery Simulation

---

# Planned Architecture

```text
Client
   ↓
API Gateway
   ↓
--------------------------------
| Authentication Service      |
| User Service                |
| Order Service               |
| Payment Service             |
| Monitoring Service          |
--------------------------------
        ↓
 PostgreSQL / Kafka
```

---

# Technologies Used

* Java 21
* Spring Boot
* Spring Security
* Spring Data JPA
* PostgreSQL
* Maven
* Docker
* Kubernetes
* Git & GitHub
* JWT Authentication

---

# Future Enhancements

* Kafka-based Event Communication
* Service Discovery using Eureka
* OpenFeign Communication
* Circuit Breaker & Retry Patterns
* Kubernetes Deployment
* Monitoring Dashboard
* Prometheus & Grafana Integration

---

# Project Goal

The primary goal of this project is to gain hands-on experience in:

* Distributed backend systems
* Cloud-native microservices
* Containerized deployment
* Fault-tolerant architecture
* Production-style backend development

---

# Repository Structure

```text
S.H.D.E.P_PROJECT/
│
├── Authentication/
├── Order/
├── users/
└── README.md
```

---

# Author

Nitish Kumar

* Java Backend Developer
* Spring Boot Enthusiast
* Learning Distributed Systems & Cloud-Native Architecture
