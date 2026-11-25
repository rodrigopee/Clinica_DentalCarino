package com.clinica.odontologia.service;

import com.clinica.odontologia.dto.KpiReportDTO;

import java.time.YearMonth;

public interface KpiService {
    KpiReportDTO generarReporteMensual(YearMonth mes);
}
