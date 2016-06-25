var $ = require('jquery');

// Set images

var darkMode = true;
$(function(){
  // Normal mone
  if(!darkMode) setNormalMode();
  else setDarkMode();

  function setNormalMode(){
    $("#openBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACaUlEQVRoQ+2Z/zVkMRTHP1MBOrAVoAJUsKsCVIAKmArYCna3AlSAClABKkAFnO+cd3PyMuG8zIs3yaz8NWdOkvf95t5v7o+MWJAxWhAefBMpzZJmkVPgF7CaAPARGAN/E9Z82VQROQMOenxhA7jrsT7LUhF5BpaBVEAnwDEgy2jtSxZEM24iIm/N2lmEL0usAb+BwxkxZFnWl8g6cJsFSfdN5AHSpfTpRl8i2miv0dlSdyxZZoqI3HsychDJgiphE/MCWeZHzUSEfUrXNVrk/yWiGKErVTGm1OFusI9cy4JdqQRCXOOPiDw0eVdqtB+auLvBYkTkSkpbXgt3Kx2awxojsgVcATeAfpc8HNYYEdNHK3IWysZhjRG5AH4C+6XUGp8conKuXWGNEVESKBGVLnTxc1hjRPqk9UN7oMMaEqlS6LqUQiJKyf8A/5r0fOgTTvleC2tIxOr3o6bGSNl46LktrCGRa2AT2Ab0u+TRwhoSMfGszLuZ0OEErWkyweoTUbWlHOspsb/V4ZvZp6j/1sLqE9kBzoHLplmX/esZN1QzsYXVJ6KURDVIVamJNSB8IrKEUhNZRmlKycPSKIfVJ6JqS74nreh3ycPqJYfVJ2LAZ+k4Dk360y6KwFRVg/j1UmiRufdwO5hWDRE9g7SwhkSqqkH8eikkUl1q4gvbhKP/qhS6ATci901l2MFN5zbF2j9TWMOAqNBf8phKTWKuVWVqEiNSrdBDjVRXg/gakEb0Gqtns9LbPyb0aL0kIn3f2Ye+HKJatrih1qNC/9APmimHoKa6Dt09gIaulbJZsXNriOSdDm9hiLwDEwalUhYBlNEAAAAASUVORK5CYII=");
    $("#saveBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACqklEQVRoQ+2ajTEDQRTH/6kAFaACVIAOqAAVGBWgAjogFZAKUAEqQAWkAuaf2b152ezt5yXvknEzmUkut7vvt+9zd2+AFbkGK8IBF+QGwBGArR4AvgE4BPCTIosEuQVwntJogc8kw0iQbwDrAPYAsAP3+jU35mmOdowNAM8AdowsUc1IoWKCxv7vQlFyDE5qMowGyCuAXUH9CODY/HYnKxlGA8QKKzVo5fBpPQlGE4Rju4K3mW8UZllAqL0gzDKBBGGWDcQHw3Qxldlj4TX2f2r4lf2k+ojbN82Mea9hWEaNWKipSfgHSbWjQKmTmkfahlLXCMuOfSHdyFTcvJXrhwemjFFx9pAyc0GavjR8pAaE6ySumagJrlOo3Qt+zwFhw7UK30ht+tWysDs1EAy98qJc2zkgnIV7AJupEhU8RwgKzJmWF+/dBfob5oAUyNVJEwnBwMAJdS0jy7Q6kSqzEwkxNNriWoYakzDjPmvEB2HnwYUZ9RUkBGFhHkz+GdPc+giSAkHH53O8zhiEckAY9uy+lxsCM01/5nFr/0UQ7C0HhKH3pFZiT/tqiFyQ2L5XDWOpJtiOE5ylkeI6KEJYA0FfmVhVjmnNA6QUgrKrl/FWQTUQvQGphegFSBcQ6iBdQaiCsGp9Mg5ic4cb0GYydiDiqTm7PUh6MaV4CkSTJzxAaiDyOGFSHwnhfJqwZth2sKQCwrX2hzOrFqbNnGJ5SwWkbanKBRJ9p6liBWwvQWIFp2tqM1GpxkdKN5h9gYZm5R55v5slK4/e3M0GH0hQnlCt1SUIT4ntQQ2F5uczUkzGxlfxkZISv5c+slAQu5Oo+cKABA5phLsozEvNrqT0kSsAlyVTp9jmGgDlnnmphjcZ8+e5LdoFNzXBkD6B8IF0MYhKH/N8QWahQH8dBR2xdBPprgAAAABJRU5ErkJggg==");
    $("#pdfBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACEklEQVRoQ+2a8TEEMRSHf1cBKqADVIAKUAEqQAWUQAdUQAeoAB1QASpgvplkJrOzu3ebZPclZjNz/9wmm/fl997LS+4W6m6/Pc9SH71JOpD0nfoiP35hBMK0WWFWAenrE7OgodLZYCxB3iVt51LGEmRD0nMuGEsQ5l7PBWMNQoxlgSkBJAtMKSDJMCWBJMGUBhINUyJIFEypIINhSgYZBGMJElOnUZvttg2sDQSGVpstQGKUYIyvmmeQ3OeR6hTZknQi6cVVuLEAfpyJawHx6ipbDDmW9JhIYgJyLelK0qekTafKfs0guNVezSBHkh4CBQCqUhFOfV8ByK2kixpdC5vvXNaqOtgxPnQvbkxSbxVNslYT5N+4FmDc9XKPFdvMFCHYCXrUOJf04UrwWBczAfHxwbXojlOC/aR518uzNUn0WwZoAvLk9o0zl72al3AY3dxXyHL072qTg2AgIJQnKHPojO7aEH+cKgBcSrrpIJkchGIRl2HVUSJs7PB8D1xb8wq2PZsMBKMJagpG31CFqpdsFVa/gNIPlYgR2r2kU0vX8gCUIF4BADAUv8/VRlWElSUeQhfKUSBO6lrNw5OfPHXjmzxr+cNTOHGOUmRyEJ9m/cTLgjU1VkaNEWD4kJVS6qhVIEcFWcWAXH1mkN4VyLXMA94zKzIrMsBdhnSdXWvM/2sNUaLZN/r3kZRJxxjbCvIHqtLMM7Ef9LMAAAAASUVORK5CYII=");
    $("#printBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABxElEQVRoQ+2YYVEEMQyFv1MADgAH4AAJSAAFSOBQAA5ACg4ABdwpAAcw2enO7JTbS9rNlu3R/m2a5L0kTdMVtvVtE5tNaqVpVgWCgoMDYgWuEWjd7wlU7aoCUUSs8lZHNbkGZIwhMzMaxYn7ZrvWVDErTHRUEzfbbUA0Kp32W0RasTulUqympVb1qfUAXAGnM6XIXGo3wDNwL33kEbidy1IhvR2QT+AYuADeChn2MnMOvAIbAWK+GbysO+vp/G9AnFnV1F0CT0HoBngZHKgqIh+DG1VuqrNagXwBR8H5bdQmqoqIpJb0C1nXNafWvhqqKiINiHYdLmn/f6bWkr9MkyJycECs30deNWR50GZFpAHJDFGLSMrnw/BFmkn4r2Myocqk2q8iEZHn9IkXgqDnHZDxtSgQZww71RWJyOKA9EPLvl+UXcx41EhcEzE5WkT6X5St9IU1cGekd9hHPGokrokxIJp73b+WLAEjk5dWvH/VEMeAyNgrk+Pa6pgWYo2x3H2z3SlAPGokBpjTRzodU4B41EgMJKePTAaSmy4p54qkVopDubINyBhzZmZyqR85Z7abWuzOfprVqX6qAsHUkmf2zsUfSpWO3QauGZUAAAAASUVORK5CYII=");

    $("#boldBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADFElEQVRoQ+2Zj5EMQRSHfxcBIiADRIAIEAEiQASIABEggiMCRIAIkAERUF/Ve/Ttbb9+PdU727e1XbU1czc93f31+9tvTnQg7eRAOHQEmU2SGYlck/RS0uWBi/8hid8vSV8lfbP7xVNkQJ4YyOJJki++l8TvXbL/mW4ZkOeSntkEb5dMsuUdpHvDpMz1VtEHSd03SaWn6wF5IQmoXTTA7tn4V03NnkpKb9wsIOXmsPgH9o+bWcnMCALDK0mPDQKYZpsVBFXDm6Fm2AtOIGyjQD5Kut2azJ5jzJ8kYXPc15pL5bUkPOcqIH9aE1WePwoMmo1hgz5nNmmURBwkMx7uFu9317wTNlCTTHrczMQeRyL3m56wkIx7p0h10uPuEySjOgcBQo73XdLvTJ63T4kQyU8DY34o6c3Mxu5m4i6bVARXu9laz8/0X1siJIeoDA6EK2rDlXS+bC6N2vNz1KNBesLJT0sUieDbIPhfFGd2IhGPwi0Qghu772ePUhJ+gMN2uiDoPEoiLYDWcyC+FN4plV+Vg84CwppQseu2OCI9TqCZLDrMTCCsifSFBNHPI0R/7KTZRoGgGqTc2dYqNhD1kcYlSyqbMKNAiMDA9DRUCSdRKzYgHdJ9YO7YfXX8USCeE+GVMq0sNkTq4xUcgIBZDSSzMb4Ygh4SYcejzBrDR23D83tm4l2l8QB5Bkw8uVLZbo9RYRVn3yCl263ZgSeXHywT2Mo7AwjeidNiLQhmzi3DInv6ALRlO/2kWMurLgwIqQmutqZaFwLEFxml61ODUIDDLvBI3EceKVXfGm3sBK5W80q89yOyE1NqzbOGMCMeBeJBqwVRPicLwNCjiru7Xg5hYQo0CmRzlyMg/0rVgmZMpMG1dq7/N8YokNaiep+zeIoPeLNVS6a9C43646UoA6FKpPv8vVmcOPf+TBLBi5HtelU/DQFVD0jLMJdIhUWjPlz9qzExBZfb9ZmvB2TJQnvewTMBwIY1VWlz4AwIupr+KNmzcis4cFL0X+fr/7tnQBYPvuaLR5A1dzsz11EimV1as89fCTH3M0C2y2IAAAAASUVORK5CYII=");
    $("#italicBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACEklEQVRoQ+2Z4TEEQRCFv4sAESACRIAIEAEiQASIABEgAkSACBABIkAEVFftVE2p3r2t2n5dW1fXf+yPq7Nf97x58+YmzEhNZoSDOcjYJpk1kWNgx4H/AA4jmpIF8tvxshvA61CYDJB14AX4BA6aF14E7prnkHcI+ZIp3bRldQHcViBbwCPwDNjz4MoAuQH2gRPgsnnjM+AUuAIMdHBlgNj6XwO2gafmje3vJrAH3A+mgBQfKUKvm/YNLACrgO1cg0s9kaKFN8BEb7UCvAM/gIk+pNQgnhZ2mx0rTOjWCTWIrX8zQjM9E72VCf4IOAcMNKTUILb+l4Ha9MKFrp6Irf+vpt11w4r4lwATfUgpJ+JpoXZ5E31YKUGK0Gst2BHlGngADDSslCCeForLhwpdrRHP9DyXD5mKaiJtpue5/KhBPC14Lh8CoVxanul5x/nRgxSh1yfe4vL1cX70IJ7peS4/ahDP9NpcftQgXUIPPfHWXVBsvynR9v8oFSBd0bY+zoctK9X2mxJt1RNJi7ZqEM/0JNFWDZIWbdUgadFWCTIt2obdYXnbXeT2693nyqKtciLeHZYs2ipBUqOtEiQ12qpApkXb0Dsspdg905NGW9VE0qOtCqQI3Y4o5YdNe7ZJSaKtCqTrV9s6t4ce3RXBysKUd5drO1no1WhbJyKdXdbtPl88B+nTpczPzCeS2e0+/+sPNg2VM8IOtsYAAAAASUVORK5CYII=");
    $("#underlineBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACrklEQVRoQ+2ZgXFNQRSGv1RAB6gAFYQKUEGoABWEChIVoAJUECpABVJCVMB87Jm5uXnent23DLE7k8m7c/eec/7//P/uffv2uCRj75LgYAL52zo5O/KvduQjcGtV/FvgwWBAJ8CdnjxZaX37RcHZ57N4u/NkC4kEMX99nS20Nq87zwRSqM0SUetE3J8dyTLazVS2FWVed54JZHpku9amtKZHpkemR7YzMD0yPTI9Mj1yjoHuV4f59vuTgfRX6v9u+f0E3ARuA35eXzcqaON0j5s8dvpcjp7W11tzZDvyHtgH7gJ+9kzrHvAIeDUCBfAQeAm8A+6X8y3PuT5sOOu6kDILxGIPgKfAMfAEOAJelwJGYFnneAYcAi9KviEdkaE3RVLK6zrwpUS+AZzuiGRTvDjd9DRTBQwBYpAz4AoQhQeDI45OJUmyosMB7CtwtQbC+1lpOTcKXybT9ILbxSshU4vW4HZ3nauKpQWIzJjEwsP0ITkT9YB5XDzn8yEhD7E1ucDsjEqojhYgBgsD2gnBmCRWG+8rMxeEmmcs0MVCIpYkSJYg7Mzzkq8KolVaETD2EJdhwTgsSDnYrZCh990TnO+wOPciGRe8Q9b9HGaOnxViL0mB6AWylJjFKgk7I8t2zGU6M/Sa8+2eMTW8IJskFYlapRXPya4g7ICMKyevHQKKDc3PdsEhyxYdG2rIz+KVmTEF4XV0MUPIjzm9QHxWFi0qClVa6rrmjyhOkG54ITOBCiJl7jXCXYBELOXhEhr+kE1B+V+Glx5xjsXasfgpzzm+LRine4wAEt2xGAsMQLWiBKDJJaGrC8sEo4AsYwrGP6Wj/JYesWA7FD6pgU3f/x1A0slHTpxARrI5IlZLR3xtV/d/cugnvzZURwsQ94dr1YhjJ6RfVVqAjC1xcLTvxNLYM1ycqNIAAAAASUVORK5CYII=");

    $("#jlBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAxUlEQVRoQ+2ZUQqAMAxD9f6HVhAEUZAtJWsI8XvtmryWTd03k2c30bFFiBrJJ5FDrbjBei4NlkIGDdBclmFX4xIiIUJyIK1FMhZOq3QglrrDUgiMVSGwhFNBwF1DhCjReF/j1WqbqietNWXXgsWWRPLOvqBz/rb4fHxorqe2veWM1Cxpjg6RZgCf7UMkREgOWL7qdl9RSvNaCiZ1CZQ2QiDbiEEhQjQXSh0ikG3EIEsi3Qciyiv/2VHnqHGWM0J1jJ3chsgJ1OoKMxb8xfQAAAAASUVORK5CYII=");
    $("#jcBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAyklEQVRoQ+2YSwqAMAxE2/sfWkFcCC46HUgawnOd38yrljhHk2c20TEQUo3kl8hVbThxnkdDSyGiATXDeNmrcYEIRIIc4GgFGWuXVYmcvvWXcy4DXovaCLGRZyWqRLLmsfsgxLYuKBEiQcbaZSFiWxeU2HLVPX17u6x+Px/cQiXyeNlLYPgMARGIBDnA0Qoy1i6rEjl9WS7nXAaws9uHxEtUiXjVE7MQkmi21Aoikk2JQRBJNFtqxc4u2ZQTxM6e4/NmF75am4aFh99k6gozkSthuAAAAABJRU5ErkJggg==");
    $("#jrBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAxklEQVRoQ+2ZQQrAIAwE9f+PbqEnoRfZTFCW7blZzIwSS+cweaZJHyON3GZyNfLctrjN9Xw9WDayCeDO13LYb/MSIzHSRCBbqwmsHEsYOX0j+E12lYZNIyoAtI7YWuiC1LA0opLrqouRLrJqboyo5LrqLD91T09oVRZ2RVEXgNblsKM4gbAYASCiETGC4gTCYmSBeHqQYgPRphFgh9cjckbqDNmEGGF51tNipM6QTbA0cnqwqYryn10l11pneUZaiXWH2xh5AfTbCjPs91NoAAAAAElFTkSuQmCC");
    $("#jfBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAtElEQVRoQ+2YwQrAMAhD2///6A12KuwSpEoIb2erJk/ptr1Cnh2iYyHEjeRJ5HFrTuzn0xApRDTAM4xld+MCEYg0OcBoNRlbTht5Ica8opSxOhxk2R0onD1ABCJNDjBaTcaW03Kzl627f/D38+F+icGMLPug2VIpiEg2DQZBZNBsqVQkkZhP3Rgh0iy6BkXuiKvZUl8QkWwaDILIoNlSqUgiMRdijBBpFl2DInfE1WyprxgiL9QKCjP+U42kAAAAAElFTkSuQmCC");

    $("#menuBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAoklEQVRoQ+2XwQnAMBDDkv2HbmlHEBiMUf82OekC6T0j3x2Z4zhIm0mNaCREwNUKgcW1n5EHp4uCU4MUceVH8bJzdpmkRjJceatGOLtMUiMZrrxVI5xdJqmRDFfeOvX6nfkf4T6Lkl72Ihn/UTSikRABVysEFtdqBKMLBTUSAotrp4zMvH5nBsF72RScuiNNYPFZNILRhYIaCYHFtRrB6ELBF6iBBi2uabeWAAAAAElFTkSuQmCC");

    $("#undoBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACJ0lEQVRoQ+2ZjTEEMRiG36uADlABOqACVIAKUAEqoANUgApQASpABXTAPDNfZnbWbbI/2Vyyc5m5ud3ZvSRP3u8vuZkm0mYT4dASxJRclXQv6UfSwSLVHaIIEE+StiS92/fCWPqC1CF2TJWiQLKDYPW6KpIlRFeQbCG6gGQN0RYke4g2IEVAhECKgfCBFAXRBFKFiJngnq0zypk3Sdy/xBpgXh4BhEE2Yw0S6IexbiXdDRmvKSFWYVi93QglCGUMjb655lNdrE8DuuwD5MvsY8DU58gY+5IuJK3ZQxaOShqw1i1UoqSAcZNFIUwMIPzozO5bwYRAnCk4n4llZk2TY+GuJR3aC9sWGIIwbUBSwzAeygCDMvgnC+htbUEWCYM1ABMNJDUMZobDrxiIy0Nzgboo4jpIGQCIZueW17yq9AFJrQx+giobvpDcF2QeDBFmjPYgaU/SsS8cDwGpwnDNacoY7UjSjaRHS57RfGSMyfr6JFFy7ESB6cqcf+8PVSQF1LqkD/MP/KRYRZj4r82+ceFLUGQJksLuu4xBNHwNnS+XYFqTiVqnkq5sK0xOKTZqsT85kcQWmNqrWBD8Az+haGysgHP3ESrt71AO4XnuIBxM8NeetzwpAcRteTmIwFcaW86KYFbUWHx79yK5K+LK96BZ5Q6CGlS+3g2Vs7VcTcup8WUwwZImV5BOauRsWhwDcejQevucqyJBU6q/sATpvGQj/2AyivwBVFOBMx0scLIAAAAASUVORK5CYII=");
    $("#redoBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACKElEQVRoQ+2Z7TEEQRCG38tABogAESACRIAMiAARkAEiQASIABEgAyKgnqqZqlNuTc9XVdva/nO3VXvd8+zbM929N9NIbDYSDk0gDZW8kbQkaU/SR6lfD4o8S1qTxOd2KYwHENR4qIXxAEI2VcN4AamG8QRSBeMNpBjGI0gRjFeQbBjPIFkw3kHMMK1BNiVtSVoPtYGFcN3SFnYALUD2JR10WPAQ/EuI9aMvqwE5CQArcxEfQ89EyxED8b3GqPr3QeWFEDgvASFtLoNjfLxLOpV0W9rw/UFpgigBIYXOQ/4DwHXtEx/iMEPkgqDEU4h6LemogwIRKgsiBwQI8pQAQKBEL8uGyAEBgmPUJYQVBABAPiVxQhWPowkJi5SIPi2nVlTjWNJFp3yqgrAoggKvQQ2C9bBqCAsIm5qacSdptwdFOAk5TAaLnSVuKrUocjuSDiVdWRwW3EPvhLEXi/dfCoRiRyPIa5peha+A/fdPUiDsD/bJqqS3JhE7OUmBfIW4qfs6Lc/uNrXACcT+LNvcmVIkvpfdCHNGm6gdvKRARnNqUTsYZXu2J030SSnC5MdIexamwCZBezhJgcTOl1m89duQpjwpEIL9iyPYAhI3PH+N0Xu5NAsIszkvHHpPh1UPyAISZxI6U3qu4g61aqWJH1tAcBHTq2c7X8VpBYkDFh0wqrgzKwgLB2LZ62ySA+JalRwQVIljKTO2K8sFcbX4+cVMIN6kGY0i36fMhjPDLU9sAAAAAElFTkSuQmCC");

    $("#bulletBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABQElEQVRoQ+2Z600DMRCEv1RA6CB0QCqADggd0AKVQCckHUAF0AFQAVABaCQfsk6KFO15I+c0/mllJzuPs7V3C2ayFjPhgYn05uTgyAp4AC5Lg2/APfDRW8P7+hERkXgFlqMffQPrUyEjIlvgBngBNoWM9q6AXbXXtTki8lXcOAfkgpbc0b6idTFi8NsjIxFR82dATURxewc+S/Tq3rslMkTrGbgtHT8B16cWLamvU0qu1OunuDHErcdE/fdUH7+Po+P3rnpmuiah5nyz92aRHbEjSQo4WknChmHtSFi6pEIPVknChmE9WIWlSyr0YJUkbBh2eIviwSosYeNC3+yNBZ0MZ0cmS9gYwI40FnQynB2ZLGFjgNk54i9WjRMShvNgFZYuqdCDVZKwYVgPVmHpkgpndyEm6XQ8WDtyPK0P+6c/uj9aLW3YeeoAAAAASUVORK5CYII=");
    $("#numberBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABr0lEQVRoQ+2ZgU0DMQxFXzdgBJgAmACYANgAJgAmaJmAjsAIMAEwAR0BJgAmAH0plk7p0VLpfI1DIp1aVZXt728n/rkJlaxJJTioDsgOcAVcA/oeDqAFfAzMgE/gNDIQaxWBmTYgW9w58l5Yx8j3FmNd6frfAimVkKVtdl1phQGibdi24mKD7gss3MH3W3YbkNLqrjHSGHHKQJWlJR2yD3wBC6fEuZk1RuZJWJmjZ+DEzauDYQNykVgQE1KJd8AlcO/g08VkX48cAK/AbVKNLo6HNtoHxBg5jNQrORCx8QQ8Aiq3fIUQVgbiPU3AuogIB+QvIIYu60HtWWl9pPusrvGXxMygDr2Mde+1ch8qrTAHY5Ujihfro9htjIyS5g2cNEY2SNYof62SkSNgF3gDdBiGWsbIQ3rBE15YadYSEzrN7f53L/0Wgpm+HhEQe5cYAoSC7AKRbtf7Q11CSK+HmbNyIBJSanZ9ahoWmFyThBBWVkam2W8AsdRdxQOxbVdBm2Y/B7SbhVjWI8q0ykiPQEmzn4VAkII0IAreHjV5qEbPmz0SAUuxVjlrNUZKyMAPqaVBLdyWhUkAAAAASUVORK5CYII=");

    $("#textformatBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABJUlEQVRoQ+1Y2xGCMBBcOrIDLUE7hQq0A0vS0RENTCSXuJc4mfWXcMe+zoMBnfyGTnBAQP5NSSkiRZwY6MpaVwA7J6JGACen2ouyD0Vuzo2qqB4CYTecCWLXjfLeJZCUw0K/nwEcUje8rldT5AJgn/lQ1lxNAI7G2j8ds7K19ntV/1sQCkhN/0uRCAPMjHhsEmOLjFgnnsVR7zMtgVh7pwA9ibEWY1qLPbqbA9liOnuLaKGIdZOYn82SqakFEJPnA9ubrCggjv/sRYNFikiRVNQ/3xDWU2vTPbKWrCVrbe+FyogyoowoIwsPFC1yaRdFTxT1yp1a687W+3MwfXuRoqwosbc6r++6Rb08GM1hn3ZWQGhUkgpJERKRtDJShEYlqVA3itwBdHtzjhnBTncAAAAASUVORK5CYII=");

    $("#textcolorBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADMklEQVRoQ+1Y7ZFNQRA9GwEiQASIABEgAisCRIAIEAEbASJABLsbASJABuqoe6q6Rs+d6Zle99XWnT9v9755c/v0Of0xfYRLso4uCQ7sQA6NyZ2RBiOnAG5X9nwBcD+b0YtghAAIZG3dAXCWCeYigLwH8BjAKwAvC2PfAHgK4ATA8SEDuQrgGwB+3gTwvTBWbP0CcO2QgdDL7wB8AvCwYigldQvAEwBkL2VlS+szgHuFkQL0cbG4B2wYXCaQG4usfi/SojE28CklSoqy+7lY6skvDII/yATiBbKe8V1WSmsJYXMgDHKyYlOrntE4GzeUH2XIZEBWplcWI4yDDwDOTSGUrH4AuO5IiSD4nMWRRXJqZQGRVJ4DoJy49OztwtQDAPZ71pgXWTUlA4gNXgU0gTCg+R2lRsmRMaZe/s+l5MC/7e+GmMkA8gzA68KzkhplRYO5mLGuFIWSKZlMTdeUDCBqEB8BUK1Yk5qVl2qKZWoTRmxAy/NWVrZOiKXSaDE11UjOMqI6wYCmxLjkZZvB5GXPaO+MMCuzQBTQ1vPSvZWQDLOZTMBTGskZIPL816W/orGt9kPyKguhGkkbZyFWZoB4GaenIfTkpcy31jWvAhsFYhtE/k3juNT90uPlXUSGUEpkzsZVi8kmO6NAalVZ3m6+2LmzeCm755y/e0aBeA2iqrVNw2uGMC7EJPfV4qcLzAgQda62ane9rGPTcCM5AsSTADXOgQM/I4uGcxChNdxIRoHUhgsyIAJCe23KVRKh5FibrPRSs1YtvSpm6N1atioNYfZiw1iOhng3uRttJKOMeA1ird9qsVNr4+Ws0EQyAsQbLtBYr+1ogdD3tdGQ1/KnSavW3NkLVHQMWqvoYedEGFEceK35aCqu3S4l1+7hRC8Qb7hgZeXNeXvlVeuWQ41kLxCvQZzujxaktVtiqJHsAWIN9rzsXaB62eC+1vnc0xxO9ABhtmIq1GyqNHL4DmEOshPJ8nzGH2NmtTj2AIl4d7O9O5DNXF95cS8jKlBb2N9VS3qBqJHbAgjf2Rx0R4E0D0xGKgc237sDSfZ87bidkZZn/hMR/7wmLUa2TL9dV4Q/wlzzM52K328AAAAASUVORK5CYII=");

    $("#advFormatToolsBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABUElEQVRoQ+3Y3Q3CMAwE4GMDRmEEmASYgJFgFTaATRgB+SFSiAp1HF8aKucJtc3P50uR0g1W0jYrcSAgoyUZiUQipArE1iIV1jxsJGIuHaljJEIqrHnYqUSuAO4AbuZRuR1PAC4ADgBeaaoSIgh5UNp5QIysTdYo7ZFjSoikcMwKOhImR8gSnwD2KZWprTUi5idCVN/+tUbCzCJ+QeTeCBgVYg6yNEaN0ECWwlQhtJDemGpEDaQXxoSohbAxZoQFwsI0IawQb0wzogXihXFBtEJaMW4ID4gV44rwgtRi3BGeEC2GgvCGzGFoCAbkG0aup5Od/P44FMmF1sb6ilIeAfJ1uiNYiaRFT2EoCDak3GY0RA9IwuzyDwWt78NUf9Y7Us61zb9B/TOEsfaPMXslEhBtBSIRbaV6PReJ9Kq0dp5IRFupXs9FIr0qrZ1nNYm8AYhtbjNRZVKfAAAAAElFTkSuQmCC");

    $("#closeBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABiUlEQVRoQ+3Z/U3DMBAF8NcN2ISOABt0kzICTMQIMAJs0hGqk4gUVUl8H+/ZpUr+jBI7P5/t+HQHPMh1eBAHdsi9RXKPyH+LyAnAN4DL4A9/AnAG8LH2HVtTyxCfAH4AvA7EGOILwPEP8r6E2YJYAxaN54GYOeIXwMvagLYW+0iMG2ERakHsmRGYEMIL6Y0JIyKQXpgUIgpRY9KIDESFKSGyEDamjKhAWBgKogqpYmgIBiSLoSJYkCiGjmBCvBgJgg1pYWQIBWQNY/eno/jmKTab93gOjZm2bw+a1oblExKEKiITfI6xezJED8g0nawvaaapnFrzNWEQaaapgCztTgaRps1syNYWK800mRDPf0KGYUE8iKXdjLYBMCARhAxThWQQEkwFUkHQMVkIA0HFZCBMBA0ThSgQFEwEokSUMV5ID0QJ44H0RKQxLcgIRArTKvRI01NH6uk+m3lKb9LMLoixGmK49GZ93FMx9G0NoU51HYPNe6S12Hk9iVvaIeIBDje/RyQ8ZOIXriZt0DO01u6oAAAAAElFTkSuQmCC");
  }

  function setDarkMode(){
    $("#openBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACjElEQVRoQ+1a7XETMRTcrQDSAakAqCChAkgFhAqACogrACogVEBSQaCCQAWECiAVbGZv7mxJVsaR77hIhvdLMz7Ju/fe0/s6YkeEO8ID/4nUpslOI5LeA3gB4FEBwCsAC5KnBXv+2qOU9AHA6xH/8JTk9xH7J9lqIr8BPARQBEjSCYB3AKwZ7/0zCaItDzEReS/JYseXZE08BvCR5JstMUyybSyRJwAuJ0Fy90NsAackF+GWUUT6i+IYgP3swd2xTPKkLxqbdyejiUwCqeAQSYMVXJHcb5ZIbwVrft2cRv5dIpIcI3ylOsbUKssbLGtaQbCrlUCKa3EbkZ993lUU7edmHd1gaWSXZFNy2nJNsmazcrK7wpohcgjgAsA3kl5XK5JWWDNEhmQwipw1sgl8ed1HJJ0BeA7gVS21xm0vUZJroZcd1oxGnAQ6Daja0fvAuMKaIbJ1Wj+3+YXYI41EztOSo5OHKRGn5J8AfCbpdbUiKcKaEhnq97ckva5Wgl5DhzUl8hXAAYBnJL2uViRFWFMinaMD2LvvZsKmNxg0TTqsSyIAXG05x/pFsqS/tek/J/9dkvFFWEMiRwC+ADgn6WZdtSLJ+CKsIRF3JVyDtJWa9A2IkMh5n5ockXSaUq0EadQSa0jE1ZZtb5+k19WKpKFeWmINiXTAt+k4zs041x1NibRVgwRpVErk3nu4m7QryQ0Rj0EirCmRtmqQYDaTEmkuNRk0GBFp1dG7S2q4AQD8IOnKsFoJ2j9rWKOA2GJqkjOtJlOTHJFmHT31keZqkNCZ7SOexnpsVnX7J3D0bL00xZx97lsu68vDlw9ukzr0zz3QLHkJ1x66hgPQyLRKTqr52eKPBGolszNEbgA9VL9MugKJkAAAAABJRU5ErkJggg==");
    $("#saveBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAC4ElEQVRoQ+2a4XHUMBCF36sAqABSAaQCQgdQAUcFDBUAFUAHXCqAq4BQQaACSAWQCpZ5HulGtmVLOvssX0D/zj5L+rRvtau1iTvSeEc40AIxsw8AngN4tALA7wCekfyTM5c9iJl9BPA656EF/5MNE4L8BnAfwDlJddBqZma6QPJocvRjAHgA4ArAYwBZMCHI6ESXBNFimZkWNRtmcRAzuwbwJDD3F5Iv9Lu7WCUwNUAay4fNyzVm9VyYaiBOPi05D8k3B+YkQJzsRn3mZEBSMCcFEoMhed6EBe90qe01dT83SIb9RHaprFjlfEZxbx/XThIktlX/B8mV0lCqkxtHhsbpyrKGRZR2PA0muCOpjLsX2VOLZWYXJNXf8s4+NrkpG8riFpkCYmY6J+nMdAFA5xRZ443OLCUgevBeytwz3L8h2TvYmdnGQSjCh03zOisB0SpsATycYbJDXdwA2HjdBzFOEJ9Gxr3MBjni5Ee7dpbwEDsnq64y8qVVA6QDcUlyY2Y6y8g3Qpjb1VokBhFIrQuzWyXIGEQA89lVfG4lt9WBZELIZ7QBqL0iuc0GcRmnr3t1t8CpLuT1H+5OzbVIitODKI3s2npfTp1x5PnJEKUgo3WvKYCHyknPSValIFmHnlKgKRAKkr4CU+Ijs4McCqHFqp7GD6QdRY69GpAplggWoqWQxaU1B0R1i8wFURVEx1IAX500in0iEhjrSCt4kfSNpKBazcx6ETuME2sCCV8nNPlR4LhRiDBOrALEnbV/dibTwMQsEfOBtYAMHVV1QPIy61qp6A3aItuvmaUSzhbErBY5tMAcy7XMTLLqVkZ+uCOrXr01RbawpcbPTlFSHZUkh2amN7P+RY0mfUXy11gfqfGzQVIrVAJyyH9TVcd/AsRXEqt9MDDmI517qqIoLu2rkuGu9Q7A20NkUPGZ9yQ1795HNbqoPf+YZdE5uFVa3XqIHsgcI9Tq42gfyCwN9BeEL3u9CXKiMAAAAABJRU5ErkJggg==");
    $("#pdfBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACN0lEQVRoQ+2Z4U3DMBCF35sAmAA2ACYAJgAmACYAJqAj0A3KBLABdALoBjABMMGhV9lSqJImOG4uQbHUP60T+7t3Zz+7REUzM6v6LcP3bwBOSH5leNfyFXQC0bBZYWpBSFb2SYnmitLZYDxBFgD2cynjCbID4CUXjBuIUtbMtnPBuIKoxnLBuIPkgukFSA6Y3oC0hekVSBuY3oGkwvQSJAWmtyB/hXEDSfFpsjMkD8ueHRoIqkxs5yCJSsgBLM9HI0ju88jgFDGzPQAXAOYkZddbNZfUChCvAGTT1c5JPrUh8QKZALgD8AFgN6hyPGSQOYCjIYOcAXgsKKA6GaQiqo3PAsiU5M3gUiv4pFlYtYZb7AGkmF47bW8VXVatEpB/k1pi011v8sboqYiKXUU/BXAN4B3AYWqKuYCYWayPBckDM5MS2k9+3fWa2QGALQDqt/Zm3gvkGYD2jSuSs5JLOE16dV+ZkbyqWqI7BzEzTVAgsidS5jRMumpD/A6qiOGW5H0ZjAeIzKJSRlGPpjHOTZZF3wuurC0VdAUJ6aOilmGMTarI9b4U3W+oDfWTSqoRtQeSl26pVQCQBYkKCGBSFd0Uq7LR1AqRVT0UU6i1Qew0tUoOT3H8Vhtf56llZvHwVBy7tRXxAInLbBx7bbGm1EXxmU3XiGD00aqU7KOaQG4UpMkEcvUZQeoikCvSTd9TN5/x7rdpJHP1GxWpi0CuSDd9T918amuk6UBd9Uv+f6SrCTYdpwrkB1FwVVGqM3mzAAAAAElFTkSuQmCC");
    $("#printBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABlUlEQVRoQ+1Z0VHDMAx9mgDYACYAJoBRYAJGoN0AJoBRYALKBLAB7QTixLm91pdiKVbSGJSvXiPbeu/p2WeFoHiYmRVhg4UQEZUmLwbIBH8OiIaZEnOW92sCNeuaFNFMaEm0FBtA9jFkYabEsuW9Zd0oLQuzfWNDkfBI39opjIvSitKaQmkx8zGAewA3AOR3S88SwDOAOTHzA4C7lrLvyPVRgHw1qESOZSlADnpp8qqEAOLFpHKe17QZSbiY+yof14oiZ0T0ma7dpwA+WgVyQkSy1Ur/oGkgLwBukwpPAK5bVaRopVY8EkCKDEwtIEorFBmIAVNpHaplqsEeQDQs1cZYrhihCDO/AbioZT0bvyCiy/V/oyjCzAsA585A3oloQ84oQJwBdE73b4HIheVIw/D2OeLkkR1P5DkYFFmZ+loZEA+P7HiiAshPX0u6i7N0uf9VmQme7KvUjJjFpzcnj+TV1HmOaCqhtyJjniODAtHscrUx8cVqH4MWZmpV2B5vWbe3RzwT9iDQBGSM5LvWcDf7lIF8AxWScvsHozktAAAAAElFTkSuQmCC");
    $("#settingsBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAFe0lEQVRoQ92agY0VRwyG7QoSKghUAFQQqCBQQaCChAoCFSRUEKgAqCBQAUcFgQoCFTj6VvaTb9+OPXu3SIiRVtq7Nzs7/9j+/Y9nVb5CMzMrhv2oqreOfq0ePaCZ3RSRf6txVfXw9x4+oJndE5F/ROSdqnJ/amb2VkR+FpH7qsr9Ye1rAHkqIn+IyDNV5T4DeSEiv4rIE1X96zAUIjIFxMx+FJGbqnrRvdzMhpM1swD5XFV/nxjrjogQU5+7vi0QB4Gr4PtPVfV5NWjlPpXbrcc0s994H0DcFUswJZAEgpWJ9lpEHo9WKTHWjXUfH+8/Efmsqje2FsT7/C0iD9LveAJxNQQzBLIC8UFE8GmuH5iIiDzMAets9Yv3+aKquONZMzOeZQxc642qsuJLc4u9EhGe/eJ96HdbREowm0A2QNxjNXyyxADMQwPYGw/uzFBnjJUmG8wV/+LvZyLCIkTcvBORR4D0udCnBHMGZARixT4RtPnfn0QEt3vRkYKZ4aqP/MI6uW2xHRYqwYyAYG5eMKRJnwzW4SWQAPe7mi8aVuDC5R6MFsHM6POnuxwMeileRq5FoOGrtLvF4EsczNBjhdABDcfxRXvvYxCbWP5Sq4I98sGFqt7dtdQHdzYzQOCOw/zTsRZM8VM1wMFzPhsuJVFi8M7I+l0eCd3ECw7XR90ipARauvji3hODBUNBAMRLKxe6MWd+97jBpVAUZ0w2HSPRMa1Kado8sD+DOMSvQxXgplwvZ5SvAwn2vJUT59ZCzFgEnYWLIUtKinV2gSIvyfeNF5MToPZShKb4ADx5Z9i6GIlN0idV5X7YHASgQ16Q9V/HZP13aJ18EDKHuBuC2WOVDsiU7F6BeMlkC1EJUEDiesRbB2ZqD7MAcQ0FzeISrDxXdo9hUvTnw/1aF0ixFxN8q6r3R6Y2s5yc6YZbEjtc3OMtH7UpFKBASYhDn09kQN8z6VBMEMtEMJfU7nscSGOty07DZyAoTvyVwReGmaHaakfY0eyeYHbLAz6YEK/hflHiJyBXrWwk+VC63xaopKGuLIPCo44AstSwrrEQxzx/QnTFWtM38/wBEyGe2L1dx7U+qGquC3Thdfr9zLUSrYWUYPBWV6Vgb/XQenZXDHYW7SxNECOwFDlkqwEEnn9Y0GgoZPqiiVrwiYEorcJEHf2Sp7DYZkFjySUdrTmALiFGQYH9+uMZvzAzSj7op2GhwueWE+KS13KaCAHaSRSkBIWysjLoNAoYEhYZG0G4aRnXTwhLQDAxNkunktCG+4UCKEVrByREY3sUsAIDiKVUtBKNUfIJYUmZqRON4X5nBb8MekbGh9vMyngARN1r5GWnulWjqEO0thpuBkgE8/QO0fUXrkOAwjI0qpWsPnHUHim4C4Y1DtlYRZwwkaXiOBPM1+3jQKL40VJ7FyO5+LA74R0ABotGPauk6K4cFKY9/GBmFmRKmmWeqoBQaYTDS56fndB1+qUzF7bOm8l5VDIt66wxqa7UOTv5bhzfwRIvw3r0VhEbv4wiwpBynZnIzjSK2OzVdzUHQMKNIjbv22Q0M4MFed/mPn9UjS9L+GZGZl6fAULPFJfh/K7Mw2JRfGBya/3EonBecmozRx3VQc8ZGM/erEpIbl5IPxJXToJ7DnqwJM8DitNgGguBdS5mQPBAx1oZDJonjpSpOl46y3A/hhyw1lDSmBlniFjhide98tEbC4RVQ41j9UisZR7r8kg+KQpTc6qL+UeicLh1TYeh1RnjcnDkYjXe2SbjGYkSYBCQnOudHbKs/Hn4dcPO42msixdgsVZRtECYZEePKyBD2Z2Oz2Y/GJg+EZsCsodTUyb+9j7h2Anku/mo5vv4zMljqvrwrD2i2OMB0fd/rZBfIXXJjcYAAAAASUVORK5CYII=");

    $("#boldBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADWElEQVRoQ+1Zi3HVMBC8rQCoADqAVACpAKgAUgFQAVABoQKSChIqIKkAUgGkg6SCZfaNxChGsk5G8RNvopmM38S2pNXeZ+8M25GBHcFhd0BGY7LKCMlHZvbJzO533PwvM9PflZn9MLMLAPq9eHiAvA1AFi/ifPHUzE4BHDufv/GYB8gHM3tvZlrgaMkimXfE7pPAsq5Pk2fE1EsAYso9WoB8BCBQ3QdJAXthZpr/YTC5dwDcBzcEkPRkSGrzr8L/9rzMDAdEAEgemtkbBQIAex4TGBWITE0+IjOTvygQzI4uQEh+M7NntcXCfTnzmZnJ5/Q7OxJWPgNQ5FwFCGsLFe4flByapA5GB3QOoHpIvRjZAAHgmU/hVtHpeYhOcugsMyTd83oWjnmkGH5bFozMJNGpaDot824TSNV0dgJI0Hg/zewaQFXnbZMRZfKTkjOTfG1mX4Z19sRHYsiWFFECvDGSkJ69P31+VUZIShyqLFAA0fVa16mET9jI3s+F8q5AGnPJpYTiVEslIDRdMc/cFiNRG9WwnIfcEWuPP8VUUsDJd5pAbHJYbWWS1TxSm6N2P4D4nlShLn2VzjsEEG2IpETi47A5ZXo5eVUsRjDDAAlgJF8kEGM9cgTgoMZoN9MKpiHJ7R2zzYYgGMXGPZXXHjBdGCGpDKxw2jJkSoelZgNJsSO5LzD7APS7OHoBiTJeUckz0mZD8cRJxg7OGYD91YB4ZHzcTMgXCts68TllLceX2c7W710ZaQESnDsq4CsAD3InnlSKs12crQKZhN2sH5CM4vIrgJgs/8I8AhBFJ1WL2SToLXlHABL7WFld9T8BkTRRqC2ZVrWS7JkQ3U2C1LiT0y7K9aEZCb1e+YXCr8rYufAblfVsf6urj4RMXEuIsRMfnzsGoLI2OxLVMKuIewGJSasGIr0vFaCsXuy4J6H3EsCsBOoFZHrKc4CU/KrfPoL5ScNp7mrd3gVICw2eZwMINScUzdZrmXo2530mRCm1gWRKF2qOe74vDsMISUUxqd3YsHaDaM0jckr3pzAnA9q0zEfX2E1UTlGd0vSZr4UR594WP6b2kHKGIlnzp2oPENlqbyYiWkWvzZ8nkv1TYbX4fFd+scrIyvtZvNwdkMVHd0sv7gwjvwEbDlNRJnuBtgAAAABJRU5ErkJggg==");
    $("#italicBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACUklEQVRoQ+2Z4ZFMURCFvxMBIkAEiAARIAI2AkSACBABIkAEiAARWBFYERzVU/Nevdp33+xUTfc1szX3z74fU3ffd7vPPd39xCVZuiQcHEH2LZJdImL7GfCgAX8q6STjUHqBeMPL3pH0Y1eYchDbt4HvwG/gyfqFrwIf41lSyjukbLLpNNdp9Rr4IGkFYvse8AX4Jimed149QN4Dj4Hnkt6sQV4CL4C3kkI/O68eIJH/t4D7kr6uQeLvXeCRpE87U0SKZmxyQWqthD7Vgu0z4ApwU9JpxjuUgky08FNSiD70cQP4BfyVFKJPWdUgMy3Yfri+sdKEvop4ynEsbGI78j+M8ERSiD4iEoJ/CrySFKApqxok8v86MJqe7XShl0bEduT/n4bQB5e/JilEn7LKItLSwtTlJYXo01YlyCD0UQu2w9nfAZ8lhejTViXITAu2B5dPFXq1RmamZ3vm8lkhKYnIkunZnrn8voPMtNBy+SyIstRqmV6rnD8EkEHo04p3cPmxnD8EkJnp2Z65/F6DtExvyeX3HWST0FMr3ulBpF+/E9MrbW3PR7MCZFNrO5bzmWlVcv22TK+itS2NSM/WthokRjvnZ1glrW01SLfWthqkW2tbBrJFa5s2w2rdeGnXb2ueW9naVkakNcMqa20rQbq2tpUgXVvbEpCLWlsgdYZVJvaFGdbwMWccYGfXV+nV7/9obatSaxB6lCjDh814jvKkpLWtAtn01Xbs2w8htWKC2JrlnmWPRpcOI83ZK097m72PINucUs/fHCPS87S3+V//ABYVeUK1+G0xAAAAAElFTkSuQmCC");
    $("#underlineBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAC6klEQVRoQ+2ZgVEUQRREuyPQDMQIhAiECIQIxAjECNQIxAiUCMQIPCMQItAQIIK23tWOrut5O3t7WIIzVRR33Gf+79/df5bBuiPLdwSHGpB/jcnGyK1kJMkXSbuD4s9tH20TUJJPkvY3yVMlrSRZVbDtqt+vBTsnT1UhJUEpfPi+ttCxuDl5GhC6e1PS2oT5xkhjZI3jm9nx69hI5PM5narZv8TMydOANLM3s693W/NI80jzSPPIzw7MOXHbyb7i0WhdU9r4va3j90LSI0l7ti+S/PJ+ig/+FJuE6yaunS5t7w7fj+WoldZC0mNJB7YXSc4lPZH0zPb7sSQ1nyc5lvRO0kfbh0m43+Ke67Pt4V3Xb1vWAqHYp5Je2D5NciLpjaQz2xQweyUZ5ngl6aWkt7bJt3bVAjmU9EHShe29JDuSvnY7P7T9bSzRus9X7de73TyyjQLmA2GHJFeS7klaFt7r4Oyr0yQ0iWYtGe4Bu7Z9fwzEcvDUBHVACvX9ZJgecBt7pSfTa+6XB02qlu4UIHQGCVF4MX2RHFgng0nyXNJp18ylhHomB9iObZQwuqqBdKwUA8IEYK5604YQtMxAWOuZTjoMCxrxowlJaBaTilH82jb5qtYkIB2YcoYsbB90P6MgpAdbLF4zsjkTiMdjFMdZxCgtk46uHxcz9/6tsDxLqhB0QZsA6UuMYpEEzDDJ6CBjumadEd95gj0xPCAnSaokmgyk111AwAAdR068p/MAgiGK4jUssC47jxHHpFvKr/MEMoMBQOwXFmu6MQtIVwBdpKhSKHJC11VnSgeYA6/IDKCAqDL3EORGjPQ3SYKcOHmLP2AIUHznHOh7hBiYgrHiAVg4nWLsVUzNBtJjhzFKgQXQmDIAwJQ72ZSFfoKtABkwBBi+8Afy63sE2cAQE2/0sWOsEzcKZErybcZunZFtFjdlr/8PSBIe29H931zLPxtqElYzkoTz4UHNpluMqX5UqQayxeJuZKvv7Wh2Uf0eK7wAAAAASUVORK5CYII=");

    $("#jlBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAtklEQVRoQ+2YQQqAQAwD7f8fvYKoZzcQDGE8d0uTaSl1jpJvSnQcCEkj+RJZa6204r7UMzOXhj4hX9QnxzDsaXQgAhGTA7SWyVg5bcxCfDa0qqRPiOpEyjuGPYXEUwdEIGJygNYyGSunjVmIqgJudtU59zuG3e3wbn6I7DrmjoeI2+Hd/H1E/v4bz81+92Bfa+0OV1o8RCBicoDWMhkrp+0j8vdmV1Fws6vOud/1zYjbMXf+GiInXiIoM2PNz0MAAAAASUVORK5CYII=");
    $("#jcBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAy0lEQVRoQ+2YWwqEMBAEnfsfOsKC+yOrTcM8yJbf8+quxBjj2OSJTXQcCJlG8ktkrbWmDafMExEfDfsJUdRPjmGzT6MDEYgkOcDSSjLWLisR6T71r9P7SeV/CbF5FyZKRArnsVshxLYuKREiScbaZSFiW5eUuN9Vt/szxAV1+/ngFpqSx2afQuKaAyIQSXKApZVkrF1WItJ9WHJnt/k2JkpLq3E+uTVCZKuKAiFSZLTcBiKyVUWB3NmLjH5tw5391aKmAN5aTcb/bHsCngQoMy6wCm8AAAAASUVORK5CYII=");
    $("#jrBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAyUlEQVRoQ+2Z0QqAUAhD8/8/2iCol14uc6KM9ZzD7VzxRnGJPCHi47KRbSQ/IpmZ25o76SciHg96Rk7cb37Hw76NjomYSFMCPlpNwcKyZSLTN4LfZkejkDGCBsCuKx8tdkOono2gyXXVmUhXsqiuiaDJddXpfepOb2iUFO2KgjbArvOwsxOt6plINUF2vYmwE63qmcib4PQipS1EGSPVs82q94ywkmTpmAgrSZaOibCSZOnoEZlebCgZ/2dHk+uu05uR7sS69WWI3N3mKDPfOQr2AAAAAElFTkSuQmCC");
    $("#jfBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAtUlEQVRoQ+2YQQ6AIAwE6f8fjYkHLh4kZZc0zXiWhc4ANcZo8kSTOgaFVDO5jMw5Z7XF7awnIt4a+hWyU33ldzjs1exgBCMmAmwtE9h0bL+G2OYTJe20yEAOexERaxkYwYiJAFvLBDYdS2dPoxMP/Px8EOdfj+OwX0f+MyFGMGIiwNYygU3H0tnT6MQD6exioLI4bi0ZSlEQRkQgZTEYkaEUBdHZRSCPY+jsxwhNAdxaJrDp2AdaoigzjA5cSAAAAABJRU5ErkJggg==");

    $("#menuBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAApUlEQVRoQ+2XwQnAMAwD4/2HdqEjSAiMuP4l4jsH0nkl35TM8RjkmkmMYCREgNUKgZVrZ3dXTh8K9gxyCKp1FC67hS8QxkgAqlWJEQtfIIyRAFSrEiMWvkAYIwGoVmXP67fmf8TyeSjMZT8k4z8KRjASIsBqhcDKtRiR0YWCGAmBlWt7jNS8fmsGkZfyWLDnjhwDKx8HIzK6UBAjIbByLUZkdKHgB5RLGBsxuwzhAAAAAElFTkSuQmCC");

    $("#undoBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACTElEQVRoQ+2ajU3DMBCF35sANgAmgG4AEwATABMAEwATwAbABMAEwATABJQJYINDD12kKiSx47SJU9VSlVb5OX9+d76zG2JJGpeEAysQKWlm6wAeAPyQPBxS3WRFHOIZwA6AD5I6DtaSQMoQAHZJ/gxGAbSPkRwhNICtFMkVohVIzhDRILlDRIGMASIIMhaIRpAxQdSCjA2iEqQEMc8c9+IPU+J8B/BC8nVeBv7lEQeR0e15GQk8R7buSN53sVeZEEswGr29riWIme16R1Vo6rs+s4M1daCrFKDazL4ImHIH3cYBgEsAG35eA3dIUmDRrbFE6QOm6KkrdudAiqNzkvod1YK1Vs8wcrsbAEfe+wlJKRRsQRA9oU8YtyclBCNlFJ9BmCiQgWE0Te+FJIkG6RvGvUABv+aqFHmokqkVyAAwms0uPHk2qtIaZAAYxYlU2WqakpNAqmBITkJ+nHLezB4B7AM4aZqOk0FKMFjULoqZHQO4BfBEUslzPjGSMqpd7vFEqW2nV5JFmfPvkZ0U6dLB2HvNbBPAJ4Apya3RKuIubDqSrB347BVZgcT6bl/XmZn2lN9C+8vZu9YyzVpnAK4B3JNUThltHtH65BTAFUnVXqMFUXwoTrQuqa2As44RL+W/Qznk73xfs0+KHTNTbaW/9hrLkzGAFEtebUQoVmpbtoq4W6nG0oZE41oka0VmyvegW+UOIjVU+TYuqApfy9K1ZtT4IimYYMsVpJUa2bqWmWkbSG9TRL+EkKUiQT+quGAFkjJqi7xnaRT5BVFvI0J6Zu63AAAAAElFTkSuQmCC");
    $("#redoBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAACVUlEQVRoQ+2Z/VEUQRTEuzMwAyECNQIhAjUCIQOMQIkAMgAiECNQIlAiEDPQCNrqc7bq6uCYz+WeV/f+ub2qnX3z234z0zNLbElwSziwAxmlpKTPAJ4BeEfyd+tzN66IpB8AXgDw72ErTAQQq/GtF2bjIC4lSd0wIUBGwIQB6YUJBdIDEw6kFSYkSAtMWJBamNAgNTBDQSS9BnAA4GWyHe6L/4+MBx1AN4ik9wCOZujwOvhb51q1Ms0gkj4mgL2ljDfJM9lyLAwgSV83R1r1vyaVH4RY5KnNIMllc5Ee7Oa/AHwCcN1q+Nb1oRSiGkSSS+gs1b8Bjnrf+AiIKpCkxPeU+ArAyWgFJqgaJaY2RaWVIFyndqlXJK3MLNECUayIJEN4Gg0JUQQiyQAG+QNgL1I5LZdEtrSW1PhA8nyOemotp2IQSV4jfloNkh4fw2MERLa00nTrNeMLybfDKf5tcz0Tem1au9iV5H20tCRdA3gD4JjkZckDa+9Jpyhuds921DwrB2J7YSPoY5ouq1HTqZZ7cyAeHx4n+yTvWhI8VZsciBYDiczObk/V4XV5diCbVmA1f06R6Vz2FUlfh40cyNbMWl47vJWdzZ6MkjiniHd+3tKekvR12MiBTM73huTo05ChLyW7Pkj6L9aSEpBpwPvTmL1XyCgBOUkHDrPuDnvfTgnItCfxOZU9V/MHy97OPtY+C+LGkqbyms3O90KWgvjUxBusO5L7vUnnaF8EklSxjX8edW9SAxJalWKQpMrCOJL0HjtUVIGE6vlKZ3Yg0dTZGkX+AgnVKEJVmYWcAAAAAElFTkSuQmCC");

    $("#bulletBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABSElEQVRoQ+2Z600DMRCEv60A6CB0ABWEDoAOaIFKQidAB6EC6IBQAVCB0UY+ZEVCSLY38p3GvyIrO7fzOFubGAtZthAeiMhoTu4dSSmtgA1wkRt8A+7NbDdaw3/1Y5nEK3B68KUv4HIuZJzIE3ANvAA3mYzvrYFnM5v2hjbHiXxmN87MzF3wqLk7vr8zs/OSQUopjcjIiXjzJ0BJxN+Zd+DDzPzz7xqZyBStLXCbO34EruYWLVfcTyl3pVzfwGqK24hxKnsqj9+Hg+P3bi4knJBu9tGiJkfkSJACilaQsNWwcqRauqBCDVZBwlbDarCqli6oUINVkLDVsNOvKBqsqiXsXKibvbOgzXBypFnCzgBypLOgzXBypFnCzgDLckT/WHWORwucBqsW9SJqNVhFqNqCqcGqRb2I2mVdiBEKHRtTjhxb8f+e9wM11MYbqr1B5wAAAABJRU5ErkJggg==");
    $("#numberBtnImg").attr("src","data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABw0lEQVRoQ+1Z0U1CQRCc6cASsAK1AqECtQOtQKxArUBLsAStQKlASsAKxArGDHlHHk8QTbxw+7xNXvh45G7nZnffzh7RE2NPcKBfQCTtAbgEMAawRzIcwIXDkoYAbgDMAZyEBZLyRJLBXFcgO6wcK7mwjRFJ2qGv3279P4GUyob9+hUjkYC4DA9JunqFsnAfvk2nW4GUFneVkcpIphPoX2g1muQAwAfJaaaDy7Zs0iP3jbBKG72QHGXbNcPCCcg5gKmZkGSVeAfgguRDhj2zLPklRyQdAngFcBupVVkHJDFyFClXut2v2XgG8ETS4bZiIYRVE1IG8dZ0wB5ExALyExBZMvQPF01V693zrM66E5LWJyGsPdfqOjwPm+whjn6Dk/3rtSKzYd8rI6UxWBkplhFJxwAGAGYkJ6U5us2f9EF89AVP689hhZW7XjMxT1cLAPZJzradRCnv1+kRz33HJLu9Vyk+r/VjCUSSdbvDywBGkfqslQ+iJAspJ7t/3Q0bzIomCSGsEl8tzX5F0iwtrXggkgYpsVtTlDOSrmYhLJVfX3I6jPw4vKzZT0MgaJxMQOx8ehbzrUggavdbIlu1+y2NlU9J/bMbd2IMIQAAAABJRU5ErkJggg==");

    $("#textcolorBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAADiUlEQVRoQ+1Y7XHVMBC8rQBSAaQCkgogFQAVABUAFQAVQCqAVABUQKiAUAFJBYQKllmPpblny08fFrxM5vnPmzi2fHu3d7sS7JZcuCU4bA/kplVyX5FtFSH5w8yOFp45B3DSu6LdK0JSAARk23UM4KInmH8B5JOZPTOzdwDe+mBJfjCzl2Z2BuD5jQVC8q6Z/TIz/R4CuJwACdW6BnBwk4Eoyx/N7CuAJ6lASYpSD8zsBQBVr8vVlVokv5nZIx8kyQEQgC/6JZkF24KsGxCS90da/QEgailo3/gHAK5H+v0eg53RrwXEkKjWF6fvpRrZ3dPjkUokFwdCazw9gajJVZU4WkmGe4ov9g1J0U80vARw2Bq8f68LkLEPPpvZTwCDEDpaXZnZvSmVSGqi6f4JgPO1YHoBCVR5DUBaISDh3ulYqcdm5v8vjXnTS1NWA5k079DQIxA1tJr+eASiil0A0N8CGoaD/ozvtVamB5BXZvbeZ9ZR7QqAAlbgAnjHCyVJjWRVarWm9AASDOJTpxXbqObpFTQlVmonFfENHTI/oVXUCVeljaBdpVYZyVUVcTpxCkAU88odJ1jIciro1BotVVkLJDS0z3zgfaSQAxInmQPexUg2A3Ge6TsACZyqoSm1aD8cvTaE0BnJ2Ge1VVkDZDZxSgzhAr3C5Ft0zTlgTUC8QZRGOO0I7leqvbEXcYGISqqc76utlcyBaDaNJJOq7LJd8u2N7DsnMOutksVaKzIziE6tBwEsuDSGBxcwvqt9i9S/yUhWA3HONap2QdBFj6wxki1AUqotjuvAYdhQVVzK/pmrSrORrAKydLjgeqYCQ3zUW5tgJEU5aVOkXm7hWiDJ/bbbQCm7S9NqGoumlwzjxtEQSe1NHtYayVogKYMYlLmqZ5ZsvNOiqhPJYiCpw4Vx2sxsR44GrieSR0Mpy59bswZIOCWMQjYCiRuo2mNQkklF97vL4Ml6AgnakbLmVbRyFfGK7neXga7FmlJUkdThwoRWs3PeXAYdmKRbrjWSpUBSBnG1PxqTkdwlLtFuKUFZIBNrnlpntoEqrcYIxCdk6dXs4UQJEImUZns4m5p+rHkP4egVBkkKiM7FjnLimAVSk91dPrsHssvsp75dVBEnULuIv0hLSoEEI7cLIPpm9qC7Fkh2wZ5InRPOfncPpGfml9baV6QgM/+jEKlvdOuRsHnaBZCiLcJfefdSUVXVIOoAAAAASUVORK5CYII=");

    $("#textformatBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABIklEQVRoQ+1Y2w3CMAy0N2IDGAE2bSeADRjJqEiNICrYCY6LrOtvGrv3qpwwJXk4CQ4CkH9TEopAkUEM5LGWiNyJ6DCIqImZL4Nqv5VlEZGRjZg5RPUCxLvhSpB33U+k5wNisFfxu4hciehk2EORityI6NjyUQ25mpn5bKn96zumINZ+j/a/BSSALCxF+R+K1Ax4ZmTQJDGFZ6Thj2dxVHlnNyBe+SpuscB2ttZztksDRCGweYrYw1qmSWJVzJipORyIZuVeGwOIZ2BfVYIimmeX9V6WLLW9pghkBBlR/NZrY1gL1oK1vt9YIiPICDLimJGaTK/j6tb029rLGvatU92Qe10R6eplAtIzxUbvAZBoxrV+UERjKHodikQzrvVLo8gD8QK3i/jvjMMAAAAASUVORK5CYII=");

    $("#advFormatToolsBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABYElEQVRoQ+3Y4W3CMBAF4PMGjMIIdBJggo5UVmGDdhM2uOqkRHJC0vjO9xw3uvwBEcf2d89BshMd5EoHcVBAeksyEolEQBWIpQUqrLnbSMRcOtCDkQiosOZu3xJh5i8ieqaUHuZegQ8y842IPonoI6X0GoeaQAaENJTr3htmQEih5frOMXOIpHDNCtoNZoaQKf4Q0WVMZWlpdYfZQohq8V+LmbvBlCBWIXKjB0wp4k/I3hgNYhOyF0aLKIK0xlgQxZBWGCtCBUFjahBqCApTizBBvDEeCDPEC+OFqILUYjwR1RArxhvhAtFiEAg3SCkGhXCFbGGQCHfIGkZ+J6JxZyffJ5ui4X7VB+QUZWELkE/SHQFJZJzxCgaCgEIWlhkMAYdkmHN+UFD1Mqw8DHlH5mMx8yk/g/q3EMTE5302SSQgigpEIopiNWkaiTQps2KQSERRrCZNI5EmZVYMcphEfgHBO/IztTuUUgAAAABJRU5ErkJggg==");

    $("#closeBtnImg").attr("src", "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAABnUlEQVRoQ+3Z/U0DMQwF8OcN2KSMABuwSRmBTsQIdISyCRsERcpJ6HS5JM57Samuf/YjvV+cc+3a8CAPexAHDsi9RfKIyL+KSAjhDcDVzH5mXngI4QnA2cwuuevIHq2E+ARwA/A6C5MQXwCeAVzM7GMLsweJu3AFcJqFWSG+AbzkNnT3Zk8LTcG0IGKEillrBqYVUQWJbxqJ8SCqIaMwXkQTRI3pQTRDVJhehAvCxjAQbggLw0J0QXoxTEQ3xIthIyiQVowCQYPUYlQIKqSEUSLokBwmld1LKb5bxXr7nmLR6Fl4ozaLy8R+QoKQRGSBrzDxaRliBGQ5TvG7pJ2m8mj9vSciRNpp0iFb2SkdN2mnSYXspVh1c0aD1PxOKDEUSA0ik81oCaAb0oJQYrogHoQK44b0IBQYF4SBYGOaIUwEE9MEUSBYmGqIEsHAVEFGIHoxRchIRA+mZqwg7exyjVtrOVMa9ExBeCJTM3qTdnalVnoVmfbRW/oj4Z6Goe+5+aG01S3tNPv1YtZif6FqvQOi2lnvukdEvDun+twvHuuiQtIZIQ4AAAAASUVORK5CYII=");
  }
});
