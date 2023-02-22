import { Toaster, ToastIcon, toast, resolveValue } from "react-hot-toast";

export const notificationDispatcher = {
    notifySuccess,
    notifyDelete,
    notifyError
}

function notifySuccess(value: any){
    toast.custom(
    (t) => (
        <div
        className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
        } max-w-md w-full bg-white dark:bg-black  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
        <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
            <div className="flex-shrink-0 pt-0.5 inline-flex items-center justify-center w-8 h-8 text-green-500 bg-green-100 rounded-lg dark:bg-green-800 dark:text-green-200 ">
                <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
            </div>
            <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                Position Added!
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                Instrument {value.instrumentName} has been added!
                </p>
            </div>
            </div>
        </div>
    </div>
    ),
    { id: "unique-notification", position: "top-center" }
    );
}


function notifyDelete(value: any){
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-black  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200 ">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Position Deleted!
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                  Instrument {value.instrumentName} has been deleted!
                </p>
              </div>
            </div>
          </div>
      </div>
      ),
    { id: "unique-notification", position: "top-center" }
  );
}

function notifyError (value: any){
    toast.custom(
      (t) => (
        <div
          className={`${
            t.visible ? 'animate-enter' : 'animate-leave'
          } max-w-md w-full bg-white dark:bg-black  shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
        >
          <div className="flex-1 w-0 p-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 pt-0.5 inline-flex items-center justify-center w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200 ">
              <svg aria-hidden="true" className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">
                  Calculation Invalid!
                </p>
                <p className="mt-1 text-sm text-gray-500 dark:text-white">
                  Instrument {value.instrumentName} price is not found! Thus, you may not calculated further 
                </p>
              </div>
            </div>
          </div>
      </div>
      ),
    { id: "unique-notification", position: "top-center" }
  );

}
