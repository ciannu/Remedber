export interface Medication {
    id: string;
    amount: number;
    days: {
      lunes: boolean;
      martes: boolean;
      miercoles: boolean;
      jueves: boolean;
      viernes: boolean;
      sabado: boolean;
      domingo: boolean;
    };
    dose: string;
    end_date: any;
    hour: string;
    name: string;
    start_date: any;
    type: string;
    profileId: string;
  }