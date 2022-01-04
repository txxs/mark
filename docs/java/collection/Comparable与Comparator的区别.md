Comparable and Comparator are two interfaces provided by Java Core API.

1. Comparable

Comparable is implemented by a class in order to be able to comparing object of itself with some other objects. The class itself must implement the interface in order to be able to compare its instance(s). The method required for implementation is compareTo(). 

class HDTV implements Comparable<HDTV> {
	private int size;
	private String brand;
 
	public HDTV(int size, String brand) {
		this.size = size;
		this.brand = brand;
	}
 
	public int getSize() {
		return size;
	}
 
	public void setSize(int size) {
		this.size = size;
	}
 
	public String getBrand() {
		return brand;
	}
 
	public void setBrand(String brand) {
		this.brand = brand;
	}
 
	@Override
	public int compareTo(HDTV tv) {
 
		if (this.getSize() > tv.getSize())
			return 1;
		else if (this.getSize() < tv.getSize())
			return -1;
		else
			return 0;
	}
}
 
public class Main {
	public static void main(String[] args) {
		HDTV tv1 = new HDTV(55, "Samsung");
		HDTV tv2 = new HDTV(60, "Sony");
 
		if (tv1.compareTo(tv2) > 0) {
			System.out.println(tv1.getBrand() + " is better.");
		} else {
			System.out.println(tv2.getBrand() + " is better.");
		}
	}
}

2. Comparator
In some situations, you may not want to change a class and make it comparable. In such cases, Comparator can be used if you want to compare objects based on certain attributes/fields. For example, 2 persons can be compared based on `height` or `age` etc


import java.util.ArrayList;
import java.util.Collections;
import java.util.Comparator;
 
class HDTV {
	private int size;
	private String brand;
 
	public HDTV(int size, String brand) {
		this.size = size;
		this.brand = brand;
	}
 
	public int getSize() {
		return size;
	}
 
	public void setSize(int size) {
		this.size = size;
	}
 
	public String getBrand() {
		return brand;
	}
 
	public void setBrand(String brand) {
		this.brand = brand;
	}
}
 
class SizeComparator implements Comparator<HDTV> {
	@Override
	public int compare(HDTV tv1, HDTV tv2) {
		int tv1Size = tv1.getSize();
		int tv2Size = tv2.getSize();
 
		if (tv1Size > tv2Size) {
			return 1;
		} else if (tv1Size < tv2Size) {
			return -1;
		} else {
			return 0;
		}
	}
}
 
public class Main {
	public static void main(String[] args) {
		HDTV tv1 = new HDTV(55, "Samsung");
		HDTV tv2 = new HDTV(60, "Sony");
		HDTV tv3 = new HDTV(42, "Panasonic");
 
		ArrayList<HDTV> al = new ArrayList<HDTV>();
		al.add(tv1);
		al.add(tv2);
		al.add(tv3);
 
		Collections.sort(al, new SizeComparator());
		for (HDTV a : al) {
			System.out.println(a.getBrand());
		}
	}
}



3. When to use Which?
A class that implements Comparator will be used in mainly two situations: 

1) It can be passed to a sort method, such as Collections.sort() or Arrays.sort(), to allow precise control over the sort order and 

2) It can also be used to control the order of certain data structures, such as sorted sets (e.g. TreeSet) or sorted maps (e.g., TreeMap).

Comparable和Comparator都是用来实现集合中元素的比较、排序的。

Comparable是在集合内部定义的方法实现的排序，位于java.util下。

Comparator是在集合外部实现的排序，位于java.lang下。


