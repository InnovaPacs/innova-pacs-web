## 1. Introducción

### 1.1 Contexto de Negocio

**Problema cuantificado:**

- PACS comerciales: $500-2,000/mes (ejemplo: Carestream, GE Healthcare)
- Consultorio pequeño: 5-10 estudios/día
- Presupuesto típico: <$200/mes para software
- **Gap:** Soluciones actuales son 3-10x más caras que presupuesto

**Impacto:**

- 70% de consultorios pequeños en México no tienen PACS digital
- Resultado: Estudios en CD/USB (se pierden, no son seguros)
- Médicos pierden 15-20 min/día buscando estudios antiguos

### 1.2 Solución Propuesta

**Med IQ RIS-PACS:**
Sistema web accesible que ofrece solo herramientas esenciales:

- RIS: Agendar citas, registrar pacientes, crear worklist
- PACS: Almacenamiento DICOM, visualización web (OHIF)
- Integración: HL7 para comunicación con equipos médicos

**Diferenciador vs competencia:**
| Feature | PACS Comercial | Med IQ |
|---------|----------------|--------|
| Costo | $500-2000/mes | $50-100/mes |
| Features | 50+ (mayoría no usados) | 10 esenciales |
| Deployment | Complejo | Docker en 30 min |
| Soporte | Requiere IT | Auto-servicio |

**Target de costo:** <$100/mes por consultorio

### 1.3 Stakeholders

| Rol                           | Expectativa                                   | Prioridad |
| ----------------------------- | --------------------------------------------- | --------- |
| **Médico Radiólogo**          | Ver estudios rápido, herramientas de medición | Alta      |
| **Administrador Consultorio** | Agendar citas, registrar pacientes fácilmente | Alta      |
| **Paciente**                  | Acceder a sus estudios desde casa             | Media     |
| **Técnico Radiólogo**         | Enviar estudios desde equipo DICOM a PACS     | Alta      |
| **IT/DevOps**                 | Deploy sencillo, bajo mantenimiento           | Media     |

### 1.4 Objetivos Medibles

| Objetivo         | Métrica        | Meta        |
| ---------------- | -------------- | ----------- |
| Reducir costo    | Costo mensual  | <$100/mes   |
| Tiempo de acceso | Cargar estudio | <5 segundos |
| Facilidad de uso | Training time  | <2 horas    |
| Disponibilidad   | Uptime         | >99%        |
