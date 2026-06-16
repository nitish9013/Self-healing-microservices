# 🚀 Self-Healing Distributed Event Platform (SHDEP)

A cloud-native microservices platform built using Spring Boot to simulate a resilient distributed architecture with secure authentication, service-to-service communication, fault tolerance, and scalable deployment strategies.

The project focuses on gaining practical experience in designing and implementing distributed backend systems using modern cloud-native technologies.

---

# 🏗️ Architecture Overview

```text
Client
   │
   ▼
API Gateway
   │
   ├───────────────────────────────┐
   │                               │
   ▼                               ▼
Authentication Service       User Service
        │                          │
        └──────────┬───────────────┘
                   ▼
             Order Service
                   │
                   ▼
            Payment Service
                   
Database Layer
(PostgreSQL)
```

---

# ✅ Implemented Microservices

## 🔐 Authentication Service

Responsible for user authentication and authorization.

### Features

* User Registration
* User Login
* JWT Authentication
* Spring Security Integration
* Secure API Access

### Technologies

* Spring Boot
* Spring Security
* JWT
* PostgreSQL
* Spring Data JPA

---

## 👤 User Service

Manages user profile information.

### Features

* Create User
* Update User
* Fetch User Details
* User Data Persistence

### Technologies

* Spring Boot
* Spring Data JPA
* PostgreSQL

---

## 📦 Order Service

Handles order management and tracking.

### Features

* Create Orders
* Fetch Orders
* Order Status Management
* Order Tracking

### Technologies

* Spring Boot
* Spring Data JPA
* PostgreSQL

---

## 💳 Payment Service

Handles payment processing and transaction management.

### Features

* Payment Processing
* Transaction Management
* Payment Status Tracking
* Integration with Order Service

### Technologies

* Spring Boot
* PostgreSQL
* OpenFeign

---

## 🌐 API Gateway

Centralized entry point for all client requests.

### Features

* Request Routing
* Authentication Handling
* Service Access Management
* Centralized API Entry Point

### Technologies

* Spring Cloud Gateway
* JWT Validation
* Spring Boot

---

# 🔄 Inter-Service Communication

The platform uses OpenFeign for communication between microservices.

### Implemented

* OpenFeign Clients
* Service-to-Service Communication
* Decoupled Service Interaction

---

# 🛠️ Technology Stack

| Category         | Technologies         |
| ---------------- | -------------------- |
| Language         | Java 21              |
| Framework        | Spring Boot          |
| Security         | Spring Security, JWT |
| Database         | PostgreSQL           |
| ORM              | Spring Data JPA      |
| API Gateway      | Spring Cloud Gateway |
| Communication    | OpenFeign            |
| Build Tool       | Maven                |
| Version Control  | Git & GitHub         |
| Containerization | Docker (Planned)     |
| Orchestration    | Kubernetes (Planned) |
| Messaging        | Kafka (Planned)      |

---

# 🚀 Planned Enhancements

### Distributed Systems

* Kafka Event-Driven Communication
* Service Discovery (Eureka)
* Circuit Breaker Pattern
* Retry Mechanisms
* Distributed Transactions

### Monitoring & Observability

* Prometheus
* Grafana Dashboards
* Centralized Logging
* Monitoring Service

### Deployment

* Docker Containerization
* Kubernetes Deployment
* CI/CD Pipeline

---

# 📁 Repository Structure

```text
SHDEP_PROJECT/
│
├── Authentication/
├── User/
├── Order/
├── Payment/
├── API-Gateway/
└── README.md
```

---

# 🎯 Learning Objectives

This project is helping me gain hands-on experience in:

* Microservices Architecture
* Distributed Systems Design
* Secure Backend Development
* Service Communication Patterns
* Cloud-Native Development
* Scalable System Design

---

# 👨‍💻 Author

Nitish Kumar

Java Backend Developer | Spring Boot Enthusiast

Currently learning and building expertise in:

* Distributed Systems
* Cloud-Native Applications
* Microservices Architecture
* DevOps & Kubernetes
* Event-Driven Systems
