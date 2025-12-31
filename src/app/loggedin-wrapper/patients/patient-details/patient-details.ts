import { Component, ElementRef, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UtilityService } from '../../../shared/services/utility.service';
import { PatientsService } from '../patients.service';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-patient-details',
  standalone: false,
  templateUrl: './patient-details.html',
  styleUrl: './patient-details.scss'
})
export class PatientDetails {
  patientDetailForm!: FormGroup;
  patientDetail: any;
  patientId: any = '';
  selectedAppointmentData: any = ''
  @ViewChild('captureElement', { static: false }) captureElement!: ElementRef;
  capturedImage: string | null = null;
  showModal = false;
  selectedAppointmentDate: any = '';
  showContentToCapture = true;
  userDetails: any = JSON.parse(localStorage.getItem('userDetails')!);

  constructor(public fb: FormBuilder, public router: Router, public activatedRoute: ActivatedRoute, public utilService: UtilityService, public patientService: PatientsService) {
    // this.patientDetailForm = this.fb.group({
    //   id: [''],
    //   firstName: [''],
    //   lastName: [''],
    //   time: [''],
    //   age: [''],
    //   email: [''],
    //   mobile: [''],
    //   reason: [''],
    //   lastVisit: [''],
    //   weight: [''],
    //   temperature: [''],
    //   bloodPressure: [''],
    //   gender: [''],
    //   address: [''],
    //   bloodGroup: ['']
    // })
  }

  ngOnInit() {
    this.patientId = this.activatedRoute.snapshot.paramMap.get('id');
    if(this.patientId) {
      setTimeout(() => { 
        this.getPatientDetails();
      });
    }
    // this.patientDetailForm.setValue({
    //   id: 4,
    //   firstName: 'Anil',
    //   lastName: 'Agarwal',
    //   time: '01:00 PM',
    //   age: 20,
    //   email: 'test@example.com',
    //   mobile: '987654321',
    //   reason: 'Follow-up',
    //   lastVisit: 'Nov 10, 2024',
    //   weight: '58 kgs',
    //   temperature: '98',
    //   bloodPressure: '120 / 80',
    //   gender: 'Male',
    //   address: 'Gurugram, Haryana',
    //   bloodGroup: 'B+'
    // })
    // this.patientDetail = this.patientDetailForm.value
    
  }

  getPatientDetails() {
    this.utilService.setSpinnerState(true);
    this.patientService.getPatientData(this.patientId).subscribe(
      (res: any) => {
        console.log(res);
        
        this.utilService.setSpinnerState(false);
        if(res?.success) {
          this.patientDetail = res?.data;
          this.initiateForm(this.patientDetail);
        }
        else {
          this.utilService.showToastMessage({
            message: res?.message,
            success: false,
          });
        }
      },
      (err: any) => {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err?.error?.message,
          success: false,
        });
      }
    );
  }

  initiateForm(data?: any) {
    this.patientDetailForm = this.fb.group({
      id: [this.patientId ?? null, [Validators.required]],
      firstName: [data?.firstName ?? null, [Validators.required]],
      lastName: [data?.lastName ?? null],
      age: [data?.age ?? null],
      mobile: [data?.mobile ?? null, [Validators.required]],
      bloodGroup: [data?.bloodGroup ?? null],
      weight: [data?.weight ?? null],
      bloodPressureUpper: [data?.bloodPressureUpper ?? null],
      bloodPressureLower: [data?.bloodPressureLower ?? null],
      temperature: [data?.temperature ?? null],
      gender: [data?.gender ?? null],
      address: [data?.address ?? null],
    })
  }

  cancel() {
    this.router.navigate(['patients'])
  }

  getAppointmentData(date: any) {
    this.selectedAppointmentDate = date;
    this.utilService.setSpinnerState(true);
    this.patientService.getAppointmentData(this.patientId, this.selectedAppointmentDate).subscribe((res: any) => {
      if(res?.success) {
        this.utilService.setSpinnerState(false);
        this.selectedAppointmentData = res?.data;
        setTimeout(() => {
          this.captureAndOpenModal(); 
        });
      }
      else {
        this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: res?.message,
          success: false,
        });
      }
    },
    err => {
      this.utilService.setSpinnerState(false);
        this.utilService.showToastMessage({
          message: err?.error?.message,
          success: false,
        });
    })
  }

  async captureAndOpenModal() {
    
    setTimeout(async () => {
      if (!this.captureElement) return;
      const element = this.captureElement.nativeElement;
  
      const canvas = await html2canvas(element);
      this.capturedImage = canvas.toDataURL('image/png');
  
      // Hide the original HTML content
      this.showContentToCapture = false;
  
      // Show modal with captured image
      this.showModal = true;
    });

  }

  closeModal() {
    this.showModal = false;
    this.showContentToCapture = true;
  }

}
